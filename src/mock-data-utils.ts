import { TimeseriesData, TimeseriesPoint } from "@ollion/flow-dashboard";
import { faker } from "@faker-js/faker";
import { FPopover, html } from "@ollion/flow-core";
import {
  FTableSchemaCell,
  FTableSchemaData,
  FTableSchemaDataRow,
  FTableSchemaHeaderCell,
} from "@ollion/flow-table";

export function getColor() {
  return (
    "#" +
    Math.floor(faker.number.float({ min: 0, max: 1 }) * 16777215).toString(16)
  );
}

const SERIES_NAMES_COLORS = [
  { "United States": "#66c2ff" },
  { Canada: "#ff6666" },
  { "United Kingdom": "#4169E1" },
  { Germany: "#ffb366" },
  { France: "#cc99ff" },
  { Japan: "#99ccff" },
  { Australia: "#ffcc99" },
  { Brazil: "#66ff99" },
  { India: "#ff99cc" },
  { China: "#ccccff" },
];

export function generateTimeseriesChartData(
  from?: Date,
  seriesCount?: number,
  pointsCount?: number
): TimeseriesData[] {
  const startFrom = new Date().getTime();
  const masterData: TimeseriesData[] = [];

  const numberOfPoints = pointsCount ?? 150; //faker.number.int({ min: 50, max: 150 });
  const numberOfSeries = seriesCount ?? 10;

  for (let j = 0; j < numberOfSeries; j++) {
    const startDate = from ? from.getTime() : startFrom;
    const points: TimeseriesPoint[] = [];
    for (let i = 0; i < numberOfPoints; i++) {
      const currentDate = startDate + i * 60 * 1000;
      let fluctuatingValue =
        Math.floor(faker.number.float({ min: 0, max: 1 }) * 10) + 50 * (j + 1); //faker.number.float({ min: 0, max: 1 }) * (yOffSet ?? 100) + Math.sin(i / 8) * 50; // Adding a sine wave for fluctuation
      if (fluctuatingValue < 0) {
        fluctuatingValue *= -1;
      }
      if (fluctuatingValue % 9 === 0) {
        fluctuatingValue = 50 * (j + 1) * getRndInteger(1, 2);
      }
      const dataPoint: TimeseriesPoint = {
        timestamp: currentDate,
        value: +fluctuatingValue.toFixed(0),
      };

      points.push(dataPoint);
    }
    masterData.push({
      name: Object.keys(SERIES_NAMES_COLORS[j]).at(0) as string,
      points,
      color: Object.values(SERIES_NAMES_COLORS[j]).at(0) as string,
      type: faker.helpers.arrayElement(["line", "bar", "area"]),
    });
  }

  return masterData;
}

export function getRndInteger(min: number, max: number) {
  return faker.number.int({ min, max });
}

function getId() {
  return faker.string.alpha(10);
}
export function getFakeUsers(rowCount = 100): FTableSchemaData {
  const users = [];

  for (let i = 0; i < rowCount; i++) {
    const name: FTableSchemaCell<string> = {
      value: faker.person.firstName() + " " + faker.person.lastName(),
      align: "middle-left",
      template: function () {
        return html`<f-div
          gap="small"
          align="middle-left"
          width="100%"
          height="100%"
        >
          <f-pictogram
            size="medium"
            .source=${faker.internet.emoji()}
          ></f-pictogram>
          <f-div direction="column" height="hug-content">
            <f-text size="small">${this.value}</f-text>
            <f-text size="x-small" state="secondary"
              >${faker.person.jobTitle()}</f-text
            >
          </f-div>
        </f-div>`;
      },
    };

    const score = {
      value: faker.number.int({ min: 18, max: 60 }),
      template: function () {
        return html`<f-div align="middle-center" width="100%" height="100%"
          ><f-text size="medium" inline>${this.value}</f-text></f-div
        >`;
      },
    };

    const email: FTableSchemaCell<string> = {
      value: faker.internet.email(),
      template: function () {
        return html`<f-div align="middle-left" width="100%" height="100%"
          ><f-text size="small" inline>${this.value}</f-text></f-div
        >`;
      },
    };

    const iPAddress: FTableSchemaCell<string> = {
      value: faker.internet.ipv4(),
      template: function () {
        return html`<f-div align="middle-left" width="100%" height="100%"
          ><f-text size="small" inline>${this.value}</f-text></f-div
        >`;
      },
    };

    const userRow: FTableSchemaDataRow = {
      id: getId(),
      disableSelection: i % 2 === 0,
      expandIconPosition: "right",
      data: { name, score, email, iPAddress },
    };
    users.push(userRow);
  }

  const header: Record<string, FTableSchemaHeaderCell> = {
    name: {
      value: "User",
    },
    email: {
      value: "Email",
    },
    iPAddress: {
      value: "IP",
    },
    score: { value: "Score", width: "100px" },
  };

  return {
    header,
    rows: users,
  };
}
