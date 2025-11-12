import PageMeta from "../../components/common/PageMeta";
import ContactsList from "./ContactsList";
import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";

export default function Contacts() {

  return (
    <>
      <PageMeta
        title="Contacts"
        description="This is Contacts page for KAV EXPEDITING"
      />
      
      <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Contacts
        </h2>

        <Link to="/contacts/create">
          <Button size="sm" variant="primary"> <PlusIcon /> Add Contact</Button>
        </Link> 

      </div>
      
      
      <div className="space-y-6">
        <ContactsList />
      </div>
    </>
  );
}