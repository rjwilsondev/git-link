import { Form, redirect, useActionData, useNavigation } from "react-router";
import { db } from "~/db";
import { repositories } from "~/db/schema";
import { createRepository } from "~/dao";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  // 1. Basic Validation
  if (!name || name.length < 3) {
    return { error: "Repository name must be at least 3 characters long." };
  }

  try {
    // 2. BFF Logic: Save to Database
    const [newRepo] = await db.insert(repositories).values({
      name,
      description,
      ownerUser: "ryan", // Placeholder for current user
    }).returning();

    // 3. Git Service: Initialize Bare Repo
    await createRepository(name);

    return redirect(`/repos/${newRepo.name}`);
  } catch (err: any) {
    return { error: err.message || "Failed to create repository" };
  }
}

export default function RepositoryNew() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-letterpress flex items-center gap-2">
            <HugeiconsIcon icon={Book02Icon} className="w-6 h-6 text-muted-foreground" size={24} />
            Create a new repository
          </h1>
          <p className="text-muted-foreground mt-2">
            A repository contains all project files, including the revision history. Already have a project repository elsewhere?
          </p>
        </div>

        <Separator />

        <Form method="post" className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Repository name *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="name"
                  name="name"
                  placeholder="my-awesome-project"
                  required
                  className="max-w-md shadow-inner bg-muted/20"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Great repository names are short and memorable. Need inspiration? How about <span className="text-green-600 font-medium">special-garbanzo</span>?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of your project"
                className="shadow-inner bg-muted/20"
              />
            </div>
          </div>

          <Separator />

          {actionData?.error && (
            <Alert variant="destructive" className="shadow-[var(--depth-shadow)]">
              <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" size={16} />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {actionData.error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Creating..." : "Create repository"}
            </Button>
            <Button variant="ghost" size="lg" >
              <a href="/">Cancel</a>
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
