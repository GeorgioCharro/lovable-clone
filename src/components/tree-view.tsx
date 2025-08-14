"use client";

import { TreeItem } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "./ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

interface TreeViewProps {
  data: TreeItem[];
  value: string | null;
  onSelect?: (filePath: string) => void;
}

export const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <SidebarProvider>
      <Sidebar className="w-full" collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=""
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

interface TreeProps {
  item: TreeItem;
  selectedValue?: string | null;
  onSelect?: (value: string) => void;
  parentPath: string;
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  // Normalize the union type:
  let name: string;
  let children: TreeItem[];
  if (Array.isArray(item)) {
    name = item[0];
    children = item.slice(1);
  } else {
    name = item;
    children = [];
  }

  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  // Leaf (file)
  if (!Array.isArray(item)) {
    const isSelected = selectedValue === currentPath;
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => onSelect?.(currentPath)}
          isActive={isSelected}
          className="data-[active=true]:bg-transparent"
        >
          <FileIcon />
          <span className="truncate">{name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Folder (can be empty; still renders as folder)
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="cursor-pointer">
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {children.length > 0 && (
            <SidebarMenuSub>
              {children.map((subItem, index) => (
                <Tree
                  key={`${currentPath}/${getItemName(subItem)}-${index}`}
                  item={subItem}
                  selectedValue={selectedValue}
                  onSelect={onSelect}
                  parentPath={currentPath}
                />
              ))}
            </SidebarMenuSub>
          )}
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

// Small helper for stable-ish keys & labels
function getItemName(node: TreeItem): string {
  return Array.isArray(node) ? node[0] : node;
}
