require "test_helper"
require "playwright"

class PlaywrightTestCase < ActiveSupport::TestCase
  def setup
    @playwright = Playwright.create(playwright_cli_executable_path: "npx playwright")
    @browser = @playwright.chromium.launch(headless: true)
    @context = @browser.new_context
    @page = @context.new_page
  end

  def teardown
    @browser&.close
    @playwright&.stop
  end

  private

  def visit(path)
    @page.goto("http://localhost:3000#{path}")
  end

  def screenshot(name)
    @page.screenshot(path: "tmp/screenshots/#{name}.png")
  end

  def page_title
    @page.title
  end

  def page_content
    @page.content
  end

  def click(selector)
    @page.click(selector)
  end

  def fill(selector, value)
    @page.fill(selector, value)
  end

  def wait_for_selector(selector, timeout: 5000)
    @page.wait_for_selector(selector, timeout: timeout)
  end
end
