/* eslint-disable react/prop-types */

import { Button, Card, Input, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import { MdOutlineFlipCameraAndroid, MdPeople, MdAdminPanelSettings } from "react-icons/md";
import BG from '@assets/staff-bg.gif'

// Import the staff pages
import StaffManagement from "./staff/Staff";
import RoleManagement from "./staff/Role";

const StaffSelection = ({ di, onSelectPage }) => {
    return (
        <div className="flex flex-col gap-6 justify-center items-center h-full w-full bg-gradient-to-br from-red-400 to-yellow-400 p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Staff Management</h1>
                <p className="text-white/80 text-lg">Choose what you'd like to manage</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                <Card {...THEME.ACTIVE} className="p-8 hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => onSelectPage('staff')}>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <MdPeople className="text-6xl text-blue-500" />
                        <h2 className="text-2xl font-bold">Staff Management</h2>
                        <p className="text-gray-600">Add, view, and manage staff members and their permissions</p>
                        <Button {...THEME.SUCCESS} className="mt-4">
                            Manage Staff
                        </Button>
                    </div>
                </Card>

                <Card {...THEME.ACTIVE} className="p-8 hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => onSelectPage('role')}>
                    <div className="flex flex-col items-center gap-4 text-center">
                        <MdAdminPanelSettings className="text-6xl text-green-500" />
                        <h2 className="text-2xl font-bold">Role Management</h2>
                        <p className="text-gray-600">Create and manage staff roles and access levels</p>
                        <Button {...THEME.SUCCESS} className="mt-4">
                            Manage Roles
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const Main = ({ di }) => {
    const [selectedPage, setSelectedPage] = useState(null);

    const handleBackToSelection = () => {
        setSelectedPage(null);
    };

    if (selectedPage === null) {
        return <StaffSelection di={di} onSelectPage={setSelectedPage} />;
    }

    return (
        <div className="h-full w-full flex bg-cover bg-center overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-48 h-full bg-black/50">
                <Card {...THEME.ACTIVE} className="p-3 flex flex-col justify-start items-center gap-2 h-full">
                    <Button {...THEME.SECONDARY} onClick={handleBackToSelection} className="w-full">
                        ← Back
                    </Button>

                    <div className="flex flex-col gap-2">
                        <Card {...THEME.SECONDARY} className={`rounded-lg cursor-pointer transition-colors`} onClick={() => setSelectedPage('staff')}>
                            <h3 className="font-semibold">Staff</h3>
                            <p className="text-sm text-gray-600">Manage staff members</p>
                        </Card>

                        <Card {...THEME.SECONDARY} className={`p-3 rounded-lg cursor-pointer transition-colors`} onClick={() => setSelectedPage('role')}>
                            <h3 className="font-semibold">Role</h3>
                            <p className="text-sm text-gray-600">Manage roles and permissions</p>
                        </Card>
                    </div>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col grow bg-cover bg-center" style={{ backgroundImage: `url(${BG})` }}>
                {/* Page Content */}
                <div className="grow w-full overflow-auto p-5">
                    {selectedPage === 'staff' && <StaffManagement di={di} />}
                    {selectedPage === 'role' && <RoleManagement di={di} />}
                </div>
            </div >
        </div >
    );
};

export default Main;


