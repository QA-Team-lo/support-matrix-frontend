import { useState } from "react";
import { Combobox, TextInput, useCombobox } from "@mantine/core";

export default function Combobar({
  items,
  explain,
}: {
  items: string[];
  explain: string;
}) {
  const combobox = useCombobox();
  const [value, setValue] = useState("");
  const shouldFilterOptions = !items.some((item) => item === value);
  const filteredOptions = shouldFilterOptions
    ? items.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase().trim())
      )
    : items;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label="Pick value or type anything"
          placeholder={explain}
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length === 0 ? (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
