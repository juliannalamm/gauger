from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync

def scrape_zillow_price(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        stealth_sync(page)


        try:
            page.goto(url)

            
            # Selectors
            address_selector = 'h1[class="Text-c11n-8-100-1__sc-aiai24-0 jbRdkh"]' #address
            price_selector = 'span[data-testid="price"]'  # Current price
            price_history_selector = 'td[data-testid="price-money-cell"]'  # Price history
            pricedate_history_selector = 'span[data-testid="date-info"]' #Price date history
            bed_bath_sqft_selector = 'div[data-testid="bed-bath-sqft-fact-container"]'
            # pricecard_selector = 'span[data-test = "property-card-price"]' #list of prices from mainpage view 

            page.wait_for_selector(price_selector, timeout=60000)
            page.wait_for_selector(price_history_selector, timeout=60000)
            page.wait_for_selector(pricedate_history_selector, timeout=60000)
            page.wait_for_selector(address_selector, timeout=60000)
            page.wait_for_selector(bed_bath_sqft_selector, timeout=1000000)

            # Extract address 
            address_element = page.locator(address_selector)
            if address_element.count() > 0: 
                address = address_element.first.inner_text()
                # print(f"Address: {address_element} ")
            else: 
                address = None
                # print("Address not found")


            # Extract current price
            price_element = page.locator(price_selector)
            if price_element.count() > 0:
                current_price = price_element.first.inner_text()
                # print(f"Current Price: {current_price}")
            else:
                current_price = None
                # print("Current Price not found.")
            
            # Extract price history
            price_history_element = page.locator(price_history_selector)
            if price_history_element.count() > 0:
                price_history = price_history_element.all_inner_texts()
                # print(f"Price History: {price_history}")
            else:
                price_history = None
                # print("Price History not found.")
            
            # Extract price date history
            pricedate_history_element = page.locator(pricedate_history_selector)
            if pricedate_history_element.count() > 0:
                pricedate_history = pricedate_history_element.all_inner_texts()
                # print(f"Price Date History: {pricedate_history}")
            else:
                pricedate_history = None
                # print("Price Date History not found.")

            #extract list of prices 
            bed_bath_sqft_element = page.locator( bed_bath_sqft_selector)
            if bed_bath_sqft_element.count() > 0: 
                bed_bath_sqft = bed_bath_sqft_element.all_inner_texts()
                # print(f'Bed, Bath, Sqft: {bed_bath_sqft}')
            else: 
                bed_bath_sqft = None
                # print("No bed, bath, or square foot info found ")
                
            # Return the extracted data as a dictionary
            return {
                "Address": address,
                "Current Price": current_price,
                "Price History": price_history,
                "Price Date History": pricedate_history,
                "Bed, Bath, Sqft": bed_bath_sqft
            }

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
        
        


result = scrape_zillow_price("https://www.zillow.com/homedetails/11724-Culver-Blvd-1-Los-Angeles-CA-90066/325799088_zpid/")

# Print the result
if result:
    for key, value in result.items():
        print(f"{key}: {value}")
else:
    print("Failed to extract data.")
