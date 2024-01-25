import { fetchAPI } from "@/lib/api";
import { createPayment } from "@/utils/helpers";
import type {
  PaytrailPaymentResponse,
  SkipPaymentParams,
} from "@/utils/models";
import { Order } from "@/utils/models";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import qs from "qs";
export const dynamic = "force-dynamic";

type Props = {
  params: {
    locale: string;
    orderUid: string;
  };
};

const getOrderInformation = async (orderUid: string) => {
  try {
    const order = await fetchAPI<Order>(`/orders/findByUid/${orderUid}`, {
      cache: "no-store",
    });
    return order;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

type PaymentApiResponse = PaytrailPaymentResponse | SkipPaymentParams;

const isSkipPayment = (
  response: PaymentApiResponse,
): response is SkipPaymentParams => {
  return "status" in response && response.status === "skip";
};

const Checkout = async ({ params: { locale, orderUid } }: Props) => {
  const order = await getOrderInformation(orderUid);
  if (!order || order.attributes.status === "ok") {
    return null;
  }
  const hostname = headers().get("host");
  const url = hostname ? `https://${hostname}` : "http://localhost:3000";
  const paymentResponse = await createPayment(order.id, url);
  console.log(paymentResponse);
  if (!paymentResponse) {
    return null;
  }
  if (isSkipPayment(paymentResponse)) {
    return redirect(
      `/${locale}/callback?${qs.stringify(paymentResponse.params)}`,
    );
  }
  const paymentProviders = paymentResponse.providers;

  return (
    <main className="container flex flex-wrap justify-center gap-3 p-2 mx-auto max-w-3xl">
      {paymentProviders
        .filter((provider) => provider.group !== "credit")
        .map((provider) => (
          <form
            className="flex justify-center items-center w-40"
            key={provider.name}
            method="POST"
            action={provider.url}
          >
            {provider.parameters &&
              provider.parameters.map((parameter) => (
                <input
                  key={parameter.name}
                  type="hidden"
                  name={parameter.name}
                  value={parameter.value}
                />
              ))}
            <button className="bg-transparent border-secondary-900 dark:border-secondary-50 border rounded h-full w-full">
              <Image
                height={60}
                width={150}
                src={provider.svg}
                alt={`${provider.name}-icon`}
              />
            </button>
          </form>
        ))}
    </main>
  );
};

export default Checkout;
