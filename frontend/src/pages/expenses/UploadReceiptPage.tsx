import { useNavigate } from 'react-router-dom';
import { EmployeeDashboard } from '../dashboard/EmployeeDashboard';

export function UploadReceiptPage() {
  const navigate = useNavigate();

  // This component will directly open the upload receipt modal
  // by directing to the EmployeeDashboard with a trigger to open the upload modal
  return (
    <div>
      <EmployeeDashboard defaultAction="upload" />
    </div>
  );
}