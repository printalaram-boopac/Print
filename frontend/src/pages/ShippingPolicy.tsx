import PolicyLayout from '@/components/PolicyLayout';

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping Policy">
      <h2>Shipping Policy</h2>
      <p>All orders are processed within 2 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. Once your order is processed and ready to ship, it typically takes 4-8 working days for delivery to your location.</p>
      <p>Delivery times may vary based on your location, courier partner, and any unforeseen delays.</p>
      <p><strong>For calculated shipping rates:</strong> Shipping charges for your order will be calculated and displayed at checkout.</p>
    </PolicyLayout>
  );
}
