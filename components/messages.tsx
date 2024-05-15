
import { RobotOutlined } from "@ant-design/icons"

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center md:-ml-12 items-end rtl:items-start">
      <div className="relative max-w-[90%] rounded-3xl px-5 py-2.5 bg-gray-200 dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}

export function RobotMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row justify-center md:-ml-12 items-center">
      <div className="flex size-8 select-none items-center justify-center rounded-full border bg-background shadow-sm">
        <RobotOutlined />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2 text-center flex items-center">
        {children}
      </div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative max-w-[90%] rounded-3xl px-5 py-2.5 bg-gray-200 dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}