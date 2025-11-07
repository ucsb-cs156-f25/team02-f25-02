package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {

  @Test
  public void admin_user_can_navigate_to_menu_item_review_create_page() throws Exception {
    setupUser(true);

    page.getByText("MenuItemReview").click();

    page.getByText("Create").click();
    assertThat(page.getByText("Create page not yet implemented")).isVisible();
  }

  @Test
  public void regular_user_can_navigate_to_menu_item_review_page() throws Exception {
    setupUser(false);

    page.getByText("MenuItemReview").click();

    assertThat(page.getByText("Index page not yet implemented")).isVisible();
  }
}
