import {
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  useSubmit,
} from "@remix-run/react";
import { LoaderFunctionArgs, type LinksFunction } from "@remix-run/node";
import appStyleHref from './app.css?url'
import { getContacts } from "./data.server";
import { useEffect } from "react";
export const links: LinksFunction = () => [
  { rel:"stylesheet", href: appStyleHref }
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q }
};

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ padding: '3rem'}}>
          <h2>Oh no! Something went wrong</h2>
          {
            isRouteErrorResponse(error) && <div>
              <div><strong>{error.status} Error</strong></div>
              <div>{error.data}</div>
              <br/>
              <Link to="/" className="buttonLink">Go back to home</Link>
            </div>
          }
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search" onChange={(e) => submit(e.currentTarget)}>
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q || ''}
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Link to="contacts/create" className="buttonLink">Create</Link>
          </div>
          <nav>
            {contacts?.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.documentId}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>

        <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
