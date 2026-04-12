import { FaCcVisa, FaCcMastercard, FaCcApplePay } from "react-icons/fa";

function PaymentMethods() {
  return (
    <div className="payment-methods">
      <FaCcVisa />
      <FaCcMastercard />
      <FaCcApplePay />
    </div>
  );
}

export default PaymentMethods;