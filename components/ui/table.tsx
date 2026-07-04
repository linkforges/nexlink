import { cn } from "@/lib/utils";
import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, forwardRef } from "react";

type TableProps = HTMLAttributes<HTMLTableElement>;

type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>((props, ref) => (
  <table ref={ref} className={cn("min-w-full divide-y divide-white/10 text-sm", props.className)} {...props} />
));
Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, TableSectionProps>((props, ref) => (
  <thead ref={ref} className={cn("bg-[#111827]", props.className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>((props, ref) => (
  <tbody ref={ref} className={cn("divide-y divide-white/10", props.className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>((props, ref) => (
  <tr ref={ref} className={cn("border-b border-white/10 last:border-0", props.className)} {...props} />
));
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>((props, ref) => (
  <th ref={ref} className={cn("whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400", props.className)} scope="col" {...props} />
));
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => (
  <td ref={ref} className={cn("px-4 py-3 text-sm text-gray-200", props.className)} {...props} />
));
TableCell.displayName = "TableCell";
