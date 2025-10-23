import { AlertsResponse } from "@/types";
import OverlayLoading from "./OverlayLoading";
import { formatDate } from "@/utils/formatTimestamp";

export default function AlertsComponent(props: AlertsResponse) {
    const { localtime, alerts, loading } = props;

    return (
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            {loading && (
                <div className="flex-1">
                    <OverlayLoading className="relative" />
                </div>
            )}
            {!loading && alerts?.length === 0 && (
                <div className="flex flex-col h-full w-full items-center justify-center text-center text-zinc-500 italic">
                    No alerts
                </div>
            )}
            {!loading && alerts?.length !== 0 && (
                <>
                    <div className="flex flex-row justify-between items-center my-6">
                        <div className="font-semibold text-lg text-white">
                            {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
                        </div>
                        {localtime ? (
                            <div className="text-zinc-400 text-sm font-medium">{formatDate(localtime)}</div>
                        ) : null}
                    </div>
                    <div className="flex flex-col space-y-4">
                        {alerts?.map((alert, idx) => (
                            <div key={idx} className="bg-zinc-900 rounded shadow text-base border-zinc-700">
                                <div className="flex items-start">
                                    <span
                                        className="inline-block w-3 h-3 bg-yellow-400 rounded-full mt-2 mr-4"
                                        aria-hidden="true"
                                    />
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold text-white mb-2">{alert.headline}</div>
                                        <div className="text-zinc-400 text-sm mb-4">
                                            Effective: {alert.effective} | Expires: {alert.expires}
                                        </div>
                                        <div className="text-zinc-300">{alert.description}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
