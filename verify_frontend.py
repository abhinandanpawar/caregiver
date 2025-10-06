import time
from selenium import webdriver
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By

def main():
    driver = None
    try:
        options = webdriver.FirefoxOptions()
        options.add_argument('--headless')
        driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()), options=options)

        base_url = "http://localhost:5173"

        # Verify Homepage
        driver.get(base_url)
        time.sleep(5)  # Wait for the page to load
        driver.save_screenshot("screenshot.png")
        heading = driver.find_element(By.TAG_NAME, "h1").text
        expected_heading = "Welcome to your Personal Dashboard"
        assert heading == expected_heading, f"Expected heading '{expected_heading}', but got '{heading}'"
        print("Homepage verification successful.")

        # Verify Mood Journal Page
        driver.get(f"{base_url}/mood")
        time.sleep(5)
        driver.save_screenshot("screenshot-mood.png")
        print("Mood Journal page screenshot captured.")

        # Verify Goals Page
        driver.get(f"{base_url}/goals")
        time.sleep(5)
        driver.save_screenshot("screenshot-goals.png")
        print("Goals page screenshot captured.")

        # Verify Kanban Page
        driver.get(f"{base_url}/kanban")
        time.sleep(5)
        driver.save_screenshot("screenshot-kanban.png")
        print("Kanban page screenshot captured.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    main()