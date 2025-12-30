import React from "react";
import { User } from "../../types/UserTypes";
export default function UserMetaCard({ user }: { user: User | null }) {
    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                    <div className="order-3 xl:order-2">
                        <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left">
                            {user?.name}
                        </h4>
                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                            <p className="text-sm text-gray-500">
                                {user?.type}
                            </p>
                            <div className="hidden h-3.5 w-px bg-gray-300 xl:block"></div>
                            <p className="text-sm text-gray-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
