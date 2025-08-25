import Payroll from "../src/components/billing2/payroll"

const payroll = (props) => {
    return (
        <div className="min-h-screen bg-black overflow-x-auto py-5 md:mt-0 mt-0">
            <Payroll {...props} />
        </div>
    )
}

export default payroll