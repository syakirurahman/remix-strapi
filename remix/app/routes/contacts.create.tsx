import { useNavigate, Form } from "@remix-run/react";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { createContact } from "./../data.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const newEntry = await createContact(data);
  
  return redirect("/contacts/" + newEntry.documentId)
}
export default function CreateContact() {
  const navigate = useNavigate();

  return (
    <Form method="post">
      <div className="create-form-grid">
        <FormInput
          aria-label="First name"
          name="first"
          type="text"
          label="First name"
          placeholder="First"
        />
        <FormInput
          aria-label="Last name"
          name="last"
          type="text"
          label="Last name"
          placeholder="Last"
        />
        <FormInput
          name="twitter"
          type="text"
          label="Twitter"
          placeholder="@jack"
        />
        <FormInput
          aria-label="Avatar URL"
          name="avatar"
          type="text"
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      <br/>
      <div className="input-field">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={6} />
      </div>

      <div className="button-group">
        <button type="submit">Create</button>
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