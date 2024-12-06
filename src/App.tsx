import { IconButton, TextField, Grid, Flex } from "@radix-ui/themes";
import "./App.css";
import { MagnifyingGlassIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState, useMemo, startTransition } from "react";

const CPUs = ["JH7110", "SG2002", "SG2042", "D1", "CV1800B", "K1", "TH1520"];

export default function MyApp() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Grid columns="3" gap="2">
      <TextField.Root placeholder="Search the docs…">
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
    </Grid>
  );
}
