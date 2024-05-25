"use client";

import {
  Combobox,
  Input,
  InputBase,
  useCombobox,
  ComboboxOptionProps,
} from "@mantine/core";
interface CustomComboboxOptionProps extends ComboboxOptionProps {
  "data-formatted-name": string;
  "data-id": number;
}

// Reusable Select Component
/**
 * Renders a select dropdown.
 *
 * @param {Object} props - The component props.
 * @param {Array<{ name: string, id: number }>} props.optionsList - The list of options.
 * @param {(value: string, id: number, formatted: string) => void} props.onOptionChange - The function to call when an option is selected.
 * @param {string} props.selectedValue - The selected value.
 * @returns {JSX.Element} - The rendered SelectDropdown component.
 */
export const SelectDropdown = ({
  optionsList,
  onOptionChange,
  selectedValue,
}: any) => {
  console.log("--- :", optionsList);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = optionsList?.map((item: any) => (
    <Combobox.Option
      value={item.name}
      key={item.id}
      data-id={item.id}
      data-formatted-name={item.url}
    >
      {item.name}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val, event) => {
        const id = (event as CustomComboboxOptionProps)[`data-id`];
        const formatted = (event as CustomComboboxOptionProps)[
          `data-formatted-name`
        ];
        onOptionChange(val, id, formatted);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {selectedValue || (
            <Input.Placeholder>Select an option...</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
