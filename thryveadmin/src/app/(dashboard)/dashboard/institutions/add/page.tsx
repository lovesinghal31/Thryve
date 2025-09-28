import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InstitutionForm } from '@/components/institutions/institution-form';

export default function AddInstitutionPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Add Institution</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">NOTE: This endpoint is currently unprotected per API spec – restrict server-side when backend is updated.</p>
          <InstitutionForm />
        </CardContent>
      </Card>
    </div>
  );
}
