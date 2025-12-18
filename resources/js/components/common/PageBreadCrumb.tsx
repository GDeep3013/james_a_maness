import { Link } from "react-router";


interface BreadcrumbItem {
  name: string;
  to: string;
}

interface BreadcrumbProps {
  pageTitle : string | BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ( { pageTitle = [] } : { pageTitle: string| BreadcrumbItem[] } ) => {


  const isString = typeof pageTitle === 'string';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>

          {isString ? (
          <li className="text-sm text-gray-800">
            {pageTitle}
          </li>
          ) : (
            pageTitle.map((item, index) => (
              <li key={index} className="text-sm text-gray-800">
                <Link 
                  to={item.to}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500"
                  >{item.name}  
                  {index < pageTitle.length - 1 && (
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke=""
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
              </Link> 
              </li>
            ))
          )}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
