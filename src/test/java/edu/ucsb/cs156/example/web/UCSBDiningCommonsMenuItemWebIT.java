package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {

  @Autowired private UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

  @Test
  public void admin_user_can_create_edit_delete_ucsbDiningCommonsMenuItem() throws Exception {

    UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem =
        UCSBDiningCommonsMenuItem.builder()
            .diningCommonsCode("ortega")
            .name("BakedPestoPastawithChicken")
            .station("EntreeSpecials")
            .build();

    ucsbDiningCommonsMenuItemRepository.save(ucsbDiningCommonsMenuItem);

    setupUser(true);

    page.getByText("UCSBDiningCommonsMenuItem").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
        .hasText("ortega");

    page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_ucsbDiningCommonsMenuItem() throws Exception {
    setupUser(false);

    page.getByText("UCSBDiningCommonsMenuItem").click();

    assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).not().isVisible();
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
        .not()
        .isVisible();
  }

  @Test
  public void admin_user_can_see_create_ucsbDiningCommonsMenuItem_buttom() throws Exception {
    setupUser(true);

    page.getByText("UCSBDiningCommonsMenuItem").click();

    assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).isVisible();
  }
}
