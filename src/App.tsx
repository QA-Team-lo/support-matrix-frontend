import { Grid } from "@mantine/core";
import Combobar from "./components/combobox";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const CPUs = ["JH7110", "SG2002", "SG2044", "D1", "SG2380", "SG2042", "TH1520"];
const Products = [
  "BananaPi BPI-F3",
  "VisionFive 2",
  "Milk-V Duo (64M)",
  "Milk-V Duo (256M)",
  "Milk-V Jupiter",
  "Pioneer Box",
];
const IPCores = [
  "SpacemiT X60",
  "SiFive U74 + SiFive S7 + SiFive E24",
  "XuanTie C906",
  "XuanTie C906 + ARM Cortex-A53",
  "XuanTie C920",
];

export default function App() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>VeRForTe</div>
      </AppShell.Header>

      <AppShell.Main>
        <Grid>
          <Grid.Col span={4}>
            <Combobar items={CPUs} explain="CPUs" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Combobar items={IPCores} explain="IP Cores" />
          </Grid.Col>
          <Grid.Col span={4}>
            <Combobar items={Products} explain="Products" />
          </Grid.Col>
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
}
