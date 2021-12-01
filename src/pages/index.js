import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Script from "next/script";

export default function Home() {
  const [connected, setConnected] = useState();
  const ref = useRef(null);

  function handleConnect() {
    if (ref.current) {
      ref.current.open();
    }
  }

  useEffect(() => {
    const id = localStorage.getItem("argyle-account-id");

    if (id) {
      setConnected(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Unit Connector</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://plugin.argyle.io/argyle.web.v3.js"
        onLoad={async () => {
          const id = localStorage.getItem("argyle-account-id");
          const token = localStorage.getItem("argyle-user-token");
          const userToken = token ? { userToken: token } : {};

          let account;

          if (id) {
            const response = await fetch(`/api/account/${id}`);
            const data = await response.json();

            if (data) {
              account = data;
            }
          }

          const pdConfig = account
            ? {
                payDistributionUpdateFlow: true,
                linkItems: [account.linkItemId],
                payDistributionConfig: account.pd,
              }
            : {
                payDistributionUpdateFlow: false,
              };

          const argyle = Argyle.create({
            pluginKey: process.env.NEXT_PUBLIC_ARGYLE_LINK_KEY,
            apiHost: process.env.NEXT_PUBLIC_ARGYLE_API_URL,
            payDistributionItemsOnly: true,
            ...pdConfig,
            ...userToken,
            onAccountConnected: async ({ accountId, userId, linkItemId }) => {
              localStorage.setItem("argyle-account-id", accountId);

              await fetch("/api/account", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: accountId,
                  userId: userId,
                  linkItemId: linkItemId,
                }),
              });

              setConnected(true);
            },

            onUserCreated: async ({ userId, userToken }) => {
              localStorage.setItem("argyle-user-token", userToken);

              await fetch("/api/user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId, token: userToken }),
              });
            },
          });

          ref.current = argyle;
        }}
      />

      <main className="bg-gray-50 w-full h-screen flex justify-center items-center antialiased">
        <div className="text-center">
          {connected && (
            <div className="text-4xl font-semibold max-w-xs mb-8">
              Successfully connected
            </div>
          )}
          <div className="flex justify-center">
            <button
              className="block bg-gray-900 px-4 py-2 text-white text-lg font-mono font-semibold rounded"
              onClick={handleConnect}
            >
              {connected ? "Update" : "Connect"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
