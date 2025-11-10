import React from "react";

interface TabItem {
  title: string;
  key: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  selected: string;
  onSelect: (item: string) => void;
}

export default function Tabs({ items, selected, onSelect }: TabsProps) {
  return (
    <div className="page-tab">
      <div className="space-y-6">
        <div>
          {/* Tab Headers */}
          <div className="">
            <nav className="flex"
            >
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onSelect(item.key)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out border  border-b-0 rounded-tl-[8px] rounded-tr-[8px]
                    ${
                      selected === item.key
                        ? " text-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-400 dark:bg-white/[0.03] dark:text-white"
                        : "bg-transparent hover:text-gray-700 border-transparent dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                >
                  {item.title}
                </button>
                  
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="tab-content border border-gray-200 p-3 mt-[-1px] bg-white rounded-[8px] rounded-tl-[0] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
            {items.find((item) => item.key === selected)?.component}
        </div>

        </div>
      </div>
    </div>
  );
}
