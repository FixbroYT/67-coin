import toast from "react-hot-toast"

export function styledToast(type: "error" | "success", text: string) {
    const style = {
        style: { 
            background: "linear-gradient(44deg,rgba(19, 22, 29, 1) 0%, rgba(26, 26, 42, 1) 100%)", 
            color:"#fff", 
            fontFamily: "Plus Jakarta Sans", 
            fontWeight: "400", 
            letterSpacing: "0.025em"  
        }
    }
        
    if (type === "error") {
        toast.error(text, style)
        return;
    }

    toast.success(text, style)
}