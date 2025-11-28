import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddJobForm from "@/components/forms/AddJobForm";

interface AddJobProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddJob({ open, onOpenChange, onSuccess }: AddJobProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };
    
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Job Listing</DialogTitle>
        </DialogHeader>
        <AddJobForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}