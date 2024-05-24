<template>
  <f-div state="default" height="100%" width="100%">
    <f-dashboard :config.prop="dashboardConfig"></f-dashboard>
  </f-div>
</template>

<script lang="ts" setup>
import { faker } from "@faker-js/faker";
import { html } from "@ollion/flow-core";
import {
  FDashboardConfig,
  FDashboardWidget,
  FHealthCheckPointValue,
} from "@ollion/flow-dashboard";
import { ref } from "vue";
import {
  generateTimeseriesChartData,
  getFakeUsers,
} from "./../mock-data-utils";

const getWidgets = () => {
  const iconsNames = [
    "p-azure",
    "p-google",
    "p-aws",
    "p-hadoop",
    "p-sonarcloud",
    "p-snowflake",
    "p-terraform",
    "p-discord",
  ];
  const widgets: FDashboardWidget[] = [];

  widgets.push({
    type: "table",
    style: "default",
    data: {
      data: getFakeUsers(10),
      sortBy: "score",
      sortOrder: "desc",
    },
    id: "tableWidget",

    size: {
      width: 7,
      height: 4,
    },
    header: {
      title: "High Risk Users",
    },
    footer: "This is style:'outline' widget",
  });

  widgets.push({
    type: "health-check",
    data: {
      pollingConfig: {
        interval: 10000,
        callback: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return faker.helpers.arrayElement([
            "success",
            "danger",
            "warning",
          ]) as FHealthCheckPointValue;
        },
        statusText(point) {
          const status = point.value === "success" ? "Active" : "Inactive";
          return html`<f-text align="right" .state=${point.value}
            >${status}</f-text
          >`;
        },
      },
    },
    id: "HealthCheckWidget",
    size: {
      height: 4,
      width: 4,
    },
    header: {
      title: faker.company.name(),
      description: faker.lorem.sentences(3),
    },
    footer: `Powered by Flow`,
  });

  for (let index = 0; index < 10; index++) {
    if (index % 2 === 0) {
      widgets.push({
        type: "timeseries",
        data: {
          series: faker.helpers.arrayElements(
            [
              "China",
              "India",
              "Brazil",
              "Australia",
              "Japan",
              "France",
              "Germany",
              "United States",
              "Canada",
              "United Kingdom",
            ],
            { min: 1, max: 3 }
          ),
        },
        id: faker.string.alpha(10),
        // state: faker.helpers.arrayElement(["success", "danger", "warning"]),
        header() {
          const name = faker.company.name();
          const description = faker.lorem.sentences(3);
          return html`<f-div
            align="middle-left"
            height="hug-content"
            padding="medium"
            gap="medium"
            border="small solid subtle bottom"
          >
            <f-icon
              .source=${faker.helpers.arrayElement(iconsNames)}
              size="large"
            ></f-icon>
            <f-div direction="column" align="middle-left">
              <f-text
                ellipsis
                .tooltip=${name}
                variant="heading"
                weight="medium"
                >${name}</f-text
              >
              <f-text ellipsis .tooltip=${description} size="small"
                >${description}</f-text
              >
            </f-div>
          </f-div>`;
        },
        footer: () => {
          const date = faker.date.recent({ refDate: new Date() });
          const state = faker.helpers.arrayElement([
            "danger",
            "success",
            "warning",
          ]);
          return html`<f-div
            padding="medium"
            gap="auto"
            border="small solid subtle top"
            height="hug-content"
          >
            <f-div gap="small" align="middle-left">
              <f-icon
                source="i-clock-outline"
                size="small"
                .state=${state}
              ></f-icon>
              <f-text .state=${state} size="small"
                >Last updated on ${date.toLocaleDateString()}
                ${date.toLocaleTimeString()}</f-text
              >
            </f-div>
            <f-button
              label="view details"
              size="x-small"
              icon-right="i-new-tab"
            ></f-button>
          </f-div>`;
        },
        size: {
          width: faker.number.int({ min: 4, max: 8 }),
          height: faker.number.int({ min: 3, max: 4 }),
        },
        rightClickMenu: [
          {
            menu: { text: "Edit", icon: "i-edit" },
            onClick: () => console.log("Edit Clicked"),
            onHover: () => console.log("Edit Hovered"),
          },
          {
            menu: { text: "Delete", icon: "i-delete" },
            onClick: () => console.log("Delete Clicked"),
            onHover: () => console.log("Delete Hovered"),
          },
        ],
      });
    } else {
      widgets.push({
        type: "big-number",
        alarm: {
          style: "badge",
          state: "danger",
          icon: "i-alarm",
        },
        data: {
          value: faker.number.int({ min: 11, max: 999 }),
          // state: faker.helpers.arrayElement(["success", "danger", "warning"]),
          prefix: "$",
          suffix: ".99",
          delta: {
            control: 300,
            positive: "down",
          },
        },
        id: faker.string.alpha(10),
        state: faker.helpers.arrayElement(["success", "danger", "warning"]),
        header: {
          title: faker.company.name(),
          description: faker.lorem.sentences(3),
        },
        footer: `Powered by Flow`,
        onClick(_e) {
          randomize();
        },
        size: {
          width: faker.number.int({ min: 1.5, max: 3 }),
          height: faker.number.int({ min: 1.5, max: 2 }),
        },
        rightClickMenu: [
          {
            menu: () =>
              html`<f-div
                gap="small"
                padding="small"
                width="240px"
                align="middle-left"
                clickable
              >
                <f-icon state="primary" size="x-small" source="i-view"></f-icon
                ><f-text state="primary" size="small">Custom template</f-text>
              </f-div>`,
            onClick: () => console.log("Custom template Clicked"),
            onHover: () => console.log("Custom template Hovered"),
          },
        ],
      });
    }
  }

  return widgets;
};
const startFrom = new Date();
const dashboardConfig = ref<FDashboardConfig>({
  widgets: getWidgets(),
  globalConfig: {
    series: generateTimeseriesChartData(startFrom),
    widget: {
      style: "outline",
      //style: "custom,#09112A"
    },
  },
});

const randomize = () => {
  dashboardConfig.value = {
    ...dashboardConfig.value,
    widgets: getWidgets(),
  };
};
</script>
