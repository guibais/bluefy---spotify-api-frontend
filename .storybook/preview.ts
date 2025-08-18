import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'
import { withRouter } from './decorators'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo'
    }
  },
  decorators: [withRouter]
};

export default preview;