import { ClipLoader } from "react-spinners";
import { Send, ArrowDownToLine, ChevronDown } from "lucide-react";

export const Spinner = () => {
    return <ClipLoader size={20} color="white" />
}

export const SendButton = () => {
    return <Send />
}

export const DownloadButton = () => {
    return <ArrowDownToLine />
}

export const ArrDown = () => {
    return <ChevronDown />
}