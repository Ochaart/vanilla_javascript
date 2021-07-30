import { fireEvent, getByText, getByTestId, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom
let container

describe('index.html', () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: 'dangerously' })
    container = dom.window.document.body
  })

  it('renders enter button and instructions', () => {
    expect(container.querySelector('.instructions')).not.toBeNull()
    expect(getByText(container, 'ENTER')).toBeInTheDocument()
    expect(container.querySelector('.zip_code')).toBeInTheDocument();
  })
  it('renders temp details', async () => {
    userEvent.click(getByText(container, 'ENTER'))
      expect(container.querySelector('.temp_details')).not.toBeNull()
  })
})