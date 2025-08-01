import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { BoardMetaData, SysMetaData } from "@/lib/data";
import { getRelativeLocaleUrl } from "astro:i18n";
import { useTranslations } from "@/i18n/utils";
import { statusClassMap } from "@/config/site";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  lang: string;
}

function Combobox({
  options = [],
  value,
  onChange,
  placeholder,
  lang,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const t = useTranslations(lang);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>{t("no_results")}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={(currentValue) => {
                  onChange("");
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={`mr-2 h-4 w-4 ${value === "" ? "opacity-100" : "opacity-0"}`}
                />
                All
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === option.value ? "opacity-100" : "opacity-0"}`}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Status cell component
const StatusCell = ({
  status,
}: {
  status: string | null;
  lang: string;
  boardDir: string;
  systemDir: string;
  fileName: string;
}) => {
  if (!status) return <span>-</span>;

  const statusClass = statusClassMap[status] ?? statusClassMap.UNKNOWN;

  return (
    <span
      className={`inline-block px-2 rounded-md font-medium ${statusClass}`}
    >
      {status}
    </span>
  );
};

// Main component interface
interface ReportListProps {
  lang: string;
  boards: BoardMetaData[];
  systems: SysMetaData[];
}

// Main component
export default function ReportList({ lang, boards, systems }: ReportListProps) {
  const t = useTranslations(lang);

  // State management
  const [sorting, setSorting] = useState<SortingState>([
    { id: "last_update", desc: true },
  ]);
  const [boardFilter, setBoardFilter] = useState("");
  const [systemFilter, setSystemFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Create column helper
  const columnHelper = createColumnHelper<SysMetaData>();

  // Build table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor("boardDir", {
        header: t("board"),
        cell: (info) => {
          const boardData = boards.find((b) => b.dir === info.getValue());
          return boardData ? boardData.product : info.getValue();
        },
      }),
      columnHelper.accessor("sysDir", {
        header: t("system"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("sys_ver", {
        header: t("sys.version"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("sys_var", {
        header: t("sys.variant"),
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("status", {
        header: t("sys.status"),
        cell: (info) => (
          <StatusCell
            status={info.getValue()}
            lang={lang}
            boardDir={info.row.original.boardDir}
            systemDir={info.row.original.sysDir?.toString()}
            fileName={info.row.original.fileName?.toString()}
          />
        ),
      }),
      columnHelper.accessor("last_update", {
        header: t("sys.update"),
        cell: (info) => info.getValue(),
      }),
    ],
    [boards, lang],
  );

  // Prepare table data
  const data = useMemo(() => {
    // Apply filters
    return systems.filter((system) => {
      // Apply board filter
      if (boardFilter && system.boardDir !== boardFilter) return false;

      // Apply system filter
      if (systemFilter && system.sys !== systemFilter) return false;

      // Apply status filter
      if (statusFilter && system.status !== statusFilter) return false;

      return true;
    });
  }, [systems, boardFilter, systemFilter, statusFilter]);

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Prepare filter options
  const boardOptions = useMemo(() => {
    return boards.map((board) => ({
      label: board.product,
      value: board.dir,
    }));
  }, [boards]);

  const systemOptions = useMemo(() => {
    const uniqueSystems = [...new Set(systems.map((sys) => sys.sys))];
    return uniqueSystems.map((sys) => ({
      label: sys,
      value: sys,
    }));
  }, [systems]);

  const statusOptions = useMemo(() => {
    const uniqueStatuses = [...new Set(systems.map((sys) => sys.status))]
      .filter(Boolean)
      .sort();
    return uniqueStatuses.map((status) => ({
      label: status,
      value: status,
    }));
  }, [systems]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
        <Combobox
          placeholder={t("select_board")}
          options={boardOptions}
          value={boardFilter}
          onChange={setBoardFilter}
          lang={lang}
        />
        <Combobox
          placeholder={t("select_system")}
          options={systemOptions}
          value={systemFilter}
          onChange={setSystemFilter}
          lang={lang}
        />
        <Combobox
          placeholder={t("select_status")}
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          lang={lang}
        />
      </div>

      {/* Data table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted() as string] || null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    window.location.href = getRelativeLocaleUrl(
                      lang,
                      `board/${row.original.boardDir}/${row.original.sysDir}-${row.original.fileName}`,
                      {
                        normalizeLocale: false,
                      },
                    );
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
