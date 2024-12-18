import { useNavigate, Form, useActionData, useLoaderData } from "@remix-run/react";
import { type ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { updateContact, getContact } from "./../data.server";
import * as z from "zod";
import invariant from "tiny-invariant";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
};
export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.contactId, "Missing contactId param");

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const formSchema = z.object({
    avatar: z.string().url().min(2),
    first: z.string().min(2),
    last: z.string().min(2),
    twitter: z.string().min(2),
  });

  const validatedFields = formSchema.safeParse({
    avatar: data.avatar,
    first: data.first,
    last: data.last,
    twitter: data.twitter,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fill out all missing fields.",
      data: null,
    }
  }

  const updatedEntry = await updateContact(params.contactId, data);  
  return redirect("/contacts/" + updatedEntry.documentId)
}
export default function EditContact() {
  const navigate = useNavigate();
  const { contact } = useLoaderData<typeof loader>();
  const formData = useActionData<typeof action>();

  return (
    <Form method="post">
      <div className="create-form-grid">
        <FormInput
          aria-label="First name"
          name="first"
          type="text"
          label="First name"
          placeholder="First"
          defaultValue={contact?.first}
          errors={formData?.errors}
        />
        <FormInput
          aria-label="Last name"
          name="last"
          type="text"
          label="Last name"
          placeholder="Last"
          defaultValue={contact?.last}
          errors={formData?.errors}
        />
        <FormInput
          name="twitter"
          type="text"
          label="Twitter"
          placeholder="@jack"
          defaultValue={contact?.twitter}
          errors={formData?.errors}
        />
        <FormInput
          aria-label="Avatar URL"
          name="avatar"
          type="text"
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
          defaultValue={contact?.avatar}
          errors={formData?.errors}
        />
      </div>
      <br/>
      <div className="input-field">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={6} defaultValue={contact?.notes} />
      </div>

      <div className="button-group">
        <button type="submit">Update</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </Form>
  );
}

function FormInput({
  type,
  name,
  label,
  placeholder,
  defaultValue = "",
  errors,
}: Readonly<{
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  errors?: Record<string, string[]>;
  defaultValue?: string;
}>) {
  return (
    <div className="input-field">
      <div>
        <label htmlFor={name}>{label}</label>
        <div>
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
          />
        </div>
      </div>
      {errors && errors[name] &&
        <ul>
          {errors[name].map((error: string) => (
            <li key={error} className="input-error">
              {error}
            </li>
          ))}
        </ul>
      }
    </div>
  );
}