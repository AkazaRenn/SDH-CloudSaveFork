import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { DialogButton, ReorderableEntry, ReorderableList } from "@decky/ui";
import { textInputPopup } from "./popups";
import { CSS_STEAM_HIGHLIGHT_COLOR } from "../helpers/commonDefs";
import * as Toaster from "../helpers/toaster";
import * as Clipboard from "../helpers/clipboard";
import PageView from "./pageView";
import FilterPickerButton from "./filePickerButton";
import Config from "../helpers/config";
import Row from "./row";

interface FiltersViewProps {
  title: string;
  description?: string;
  fullPage: boolean;
  getFiltersFunction: () => Promise<Array<string>>;
  setFiltersFunction: (filters: Array<string>) => Promise<void>;
}

export default function filtersView({ title, description, fullPage = false, getFiltersFunction, setFiltersFunction: setFiltersFunction, children }: PropsWithChildren<FiltersViewProps>) {
  const saveButtonRef = useRef<HTMLDivElement>(null);

  const [filterEntries, setFilterEntries] = useState<Array<ReorderableEntry<void>>>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(Config.get("advanced_mode"));

  const filterEntriesToArray = (): Array<string> => {
    return filterEntries
      .sort((a, b) => a.position - b.position)
      .map((e) => String(e.label));
  }

  const filterEntriesFromArray = (arr: Array<string>): void => {
    setFilterEntries(arr.map((value, index) => ({
      label: value,
      position: index,
    })));
  }

  const filterEntriesAppend = (element: string): void => {
    setFilterEntries(filterEntries.concat({
      label: element,
      position: filterEntries.length,
    }));
  }

  const filterEntriesRemove = (position: number): void => {
    setFilterEntries(filterEntries
      .filter((entry) => entry.position != position)
      .map((entry) => ({
        ...entry,
        position: entry.position > position ? entry.position - 1 : entry.position
      }))
    );
  }

  useEffect(() => {
    const registrations: Array<Unregisterable> = [];
    registrations.push(Config.on("advanced_mode", setShowAdvancedOptions));
    return () => {
      registrations.forEach(e => e.unregister());
    }
  }, []);

  useEffect(() => {
    getFiltersFunction().then(filterEntriesFromArray);
  }, [getFiltersFunction]);

  return (
    <PageView
      title={title}
      description={description}
      fullPage={fullPage}
      titleItem={children}
    >
      <div style={{
        overflowY: "scroll",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingBottom: "14px",
      }}>
        <ReorderableList
          onSave={setFilterEntries}
          entries={filterEntries}
        />
        <Row>
          <FilterPickerButton
            text="Add Include Filter"
            onConfirm={(path: string) => filterEntriesAppend(`+ ${path}`)}
          />
          <FilterPickerButton
            text="Add Exclude Filter"
            onConfirm={(path: string) => filterEntriesAppend(`- ${path}`)}
          />
        </Row>
        {showAdvancedOptions && (
          <Row>
            <DialogButton
              onClick={() => textInputPopup(
                "Add Arbitrary String",
                "",
                (value: string) => filterEntriesAppend(`${value}`)
              )}
            >
              Add Arbitrary Line
            </DialogButton>
            <DialogButton
              onClick={() => {
                Clipboard.copy(filterEntriesToArray().join('\n'));
                Toaster.toast("Filters copied to clipboard")
              }}
            >
              Copy Whole Filter
            </DialogButton>
            <DialogButton
              onClick={() => {
                filterEntriesFromArray(Clipboard.paste().trim().split('\n'));
                Toaster.toast("Filters pasted from clipboard");
              }}
            >
              Paste Whole Filter
            </DialogButton>
          </Row>
        )}
        <Row>
          <DialogButton
            onClick={() => setFiltersFunction(filterEntriesToArray())}
            ref={saveButtonRef}
            style={{ backgroundColor: CSS_STEAM_HIGHLIGHT_COLOR }}
            onGamepadFocus={() => saveButtonRef.current && (saveButtonRef.current.style.backgroundColor = "white")}
            onGamepadBlur={() => saveButtonRef.current && (saveButtonRef.current.style.backgroundColor = CSS_STEAM_HIGHLIGHT_COLOR)}
          >
            Save
          </DialogButton>
        </Row>
      </div>
    </PageView>
  )
}