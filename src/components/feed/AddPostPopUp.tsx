import { Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddPostProps {
  applyOpen: boolean;
  setApplyOpen: (open: boolean) => void;
}

export default function AddPostPopUp({ applyOpen, setApplyOpen }: AddPostProps) {
  return (
    <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
            <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>Write something and add image (PNG/JPEG)</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 [&>div]:grid [&>div]:gap-3">
          <div>
            <Label htmlFor="text">Text</Label>
            <Input required type="text" placeholder="What's on your mind?" />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input required type="file" accept=".png,.jpeg,.jpg" className="min-h-20" />
          </div>
        </form>
        <DialogFooter className="flex w-full gap-2">
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-xl bg-blue-500 text-white hover:bg-blue-600"
          >
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
