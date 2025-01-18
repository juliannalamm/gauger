from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import random
import time
from playwright_stealth import stealth_sync



def scrape_zillow_price(url):
    start_time = time.time()
    MAX_RETRIES = 3

    with sync_playwright() as p:
        USER_AGENTS = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        ]
        user_agent = random.choice(USER_AGENTS)
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(user_agent=user_agent)
        page = context.new_page()
        stealth_sync(page)

        for attempt in range(MAX_RETRIES):
            try:
                # Navigate to the page
                page.goto(url, timeout=60000)

                # Human-like interaction
                page.mouse.wheel(0, 200)
                time.sleep(random.uniform(2, 4))
                page.mouse.wheel(0, 200)

                # CAPTCHA Handling
                iframe_selector = 'iframe[title="Human verification challenge"]'
                captcha_iframes = page.locator(iframe_selector)

                if captcha_iframes.count() > 0:
                    print("CAPTCHA detected. Attempting to solve...")

                    for i in range(captcha_iframes.count()):
                        try:
                            iframe_element = captcha_iframes.nth(i)  # Get the iframe locator
                            iframe = iframe_element.content_frame()  # Access the Frame object

                            if iframe:
                                print("Iframe content loaded. Checking for CAPTCHA...")
                                press_and_hold_selector = 'p:has-text("Press & Hold")'
                                iframe.wait_for_selector(press_and_hold_selector, timeout=10000)
                                print(iframe.content())
                                button = iframe.locator(press_and_hold_selector)

                                if button.count() > 0:
                                    button.click()
                                    page.wait_for_timeout(5000)  # Wait for CAPTCHA to process
                                    print("Attempting to solve CAPTCHA...")

                                    # Verify if CAPTCHA was solved
                                    if not iframe.locator(press_and_hold_selector).is_visible():
                                        print("CAPTCHA solved successfully!")
                                        break
                                else:
                                    print("CAPTCHA button not found in this iframe.")
                            else:
                                print("Failed to access iframe content.")
                        except Exception as e:
                            print(f"Error in iframe interaction: {e}")
                    else:
                        print("Failed to solve CAPTCHA after all attempts.")
                        return
                else:
                    print("No CAPTCHA detected. Proceeding with scraping...")

                # Extract content with BeautifulSoup
                soup = BeautifulSoup(page.content(), 'html.parser')
                address = soup.select_one('h1[class="Text-c11n-8-100-1__sc-aiai24-0 jbRdkh"]')
                price = soup.select_one('span[data-testid="price"]')
                price_history_elements = soup.select('td[data-testid="price-money-cell"]')
                pricedate_history_elements = soup.select('span[data-testid="date-info"]')

                # Print extracted data
                print(f"Address: {address.text.strip() if address else 'Not found'}")
                print(f"Current Price: {price.text.strip() if price else 'Not found'}")
                price_history = [element.text.strip() for element in price_history_elements]
                print(f"Price History: {price_history if price_history else 'Not found'}")
                pricedate_history = [element.text.strip() for element in pricedate_history_elements]
                print(f"Price Date History: {pricedate_history if pricedate_history else 'Not found'}")

                break  # Exit retry loop on success

            except Exception as e:
                print(f"Retry {attempt + 1}/{MAX_RETRIES} failed: {e}")
                time.sleep(5)  # Wait before retrying

        else:
            print("Failed after maximum retries")
        browser.close()

    end_time = time.time()
    print(f"Time to completion: {end_time - start_time:.2f} seconds")


# Test the function
scrape_zillow_price(
    url="https://www.zillow.com/homedetails/8117-Bleriot-Ave-Los-Angeles-CA-90045/20380260_zpid/"
)
