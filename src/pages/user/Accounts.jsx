/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";

const Accounts = ({ di }) => {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        di.request.get({
            url: di.api.get('account-all'), callback: (data) => {
                setAccounts(data.data);
            }
        });
    }, []);

    return (
        <div className='flex flex-col gap-2 w-full h-full'>
            {accounts.map((account) => (
                <Card key={account.id} {...THEME.SECONDARY}>
                    {account.name}
                </Card>
            ))}
        </div>
    );
};
export default Accounts;