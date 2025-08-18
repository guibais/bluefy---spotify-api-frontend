import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAt } from '@/test-utils/router'
import * as m from '@/paraglide/messages.js'
import { spotifyAuth } from '@/services/spotifyAuth'

vi.mock('@/services/spotifyAuth', async () => {
  const actual = await vi.importActual<any>('@/services/spotifyAuth')
  return {
    ...actual,
    spotifyAuth: {
      ...actual.spotifyAuth,
      redirectToSpotifyAuth: vi.fn().mockResolvedValue(undefined),
    },
  }
})

describe('/login route', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    ;(spotifyAuth.redirectToSpotifyAuth as any).mockClear?.()
  })

  it('renders texts and login button', async () => {
    renderAt('/login?from=/profile')
    expect(await screen.findByRole('heading', { name: m.login_title() })).toBeInTheDocument()
    expect(screen.getByText(m.login_description())).toBeInTheDocument()
    expect(screen.getByRole('button', { name: m.login_button() })).toBeInTheDocument()
    expect(screen.getByText(m.login_redirect_note())).toBeInTheDocument()
    expect(screen.getByLabelText(m.language_label())).toBeInTheDocument()
  })

  it('starts login passing query state', async () => {
    renderAt('/login?from=/profile')
    await user.click(await screen.findByRole('button', { name: m.login_button() }))
    expect(spotifyAuth.redirectToSpotifyAuth).toHaveBeenCalledWith('/profile')
  })

  it('switches language to English', async () => {
    const assignMock = vi.fn()
    vi.stubGlobal('location', { ...window.location, pathname: '/login', search: '?from=/profile', hash: '', assign: assignMock } as any)
    renderAt('/login?from=/profile')
    const select = await screen.findByLabelText(m.language_label())
    await user.selectOptions(select, 'en')
    expect(assignMock).toHaveBeenCalledWith('/en/login?from=/profile')
    vi.unstubAllGlobals()
  })

  it('switches language from English to Portuguese', async () => {
    const assignMock = vi.fn()
    vi.stubGlobal('location', { ...window.location, pathname: '/en/login', search: '?from=/profile', hash: '', assign: assignMock } as any)
    renderAt('/login?from=/profile')
    const select = await screen.findByLabelText(m.language_label())
    await user.selectOptions(select, 'pt-BR')
    expect(assignMock).toHaveBeenCalledWith('/login?from=/profile')
    vi.unstubAllGlobals()
  })
})
