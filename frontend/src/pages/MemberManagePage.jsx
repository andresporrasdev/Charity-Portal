import MemberManageTable from "../components/MemberManageTable";
import "./MemberManage.css";

const MemberManagePage = () => {
  return (
    <div className="member-manage-page">
      <h2>Member Management</h2>
      <MemberManageTable />
    </div>
  );
};

export default MemberManagePage;
