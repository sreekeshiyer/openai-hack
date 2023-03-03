import Head from "next/head";

export default function Layout({ title, children }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Education App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="bg-gray-800 w-full min-h-[100vh]">{children}</main>
        </>
    );
}
