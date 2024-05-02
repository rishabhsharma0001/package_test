import type { Meta, StoryObj } from "@storybook/react";
import TileChart from "./Tilechart";

const meta = {
  title: "UI/TileChart",
  component: TileChart,
  tags: ["autodocs", "tilechart", "ui"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof TileChart>;

export default meta;

type Story = StoryObj<typeof meta>;
const statuses = ["present", "late", "absent"];
const dummyData = [];

for (let month = 0; month < 12; month++) {
  for (let day = 1; day <= 31; day++) {
    const date = new Date(2024, month, day);
    // Check if the day is valid for the current month
    if (date.getMonth() === month) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      dummyData.push({ date: date.toISOString().split('T')[0], status });
    }
  }
}

export const Default: Story = {
    args: {
        data: dummyData.map(item => ({ ...item, date: item.date || "", status: item.status as "present" | "late" | "absent" | undefined })),
        range: 12,
    },
};

export const Empty: Story = {
  args: { data: [] },
};

export const Single: Story = {
  args: { data:dummyData.map(item => ({ ...item, date: item.date || "", status: item.status as "present" | "late" | "absent" | undefined })), range: 3 },
};
