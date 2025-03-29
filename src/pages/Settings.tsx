
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ρυθμίσεις"
        description="Διαχειριστείτε τις ρυθμίσεις της εφαρμογής"
        icon={<SettingsIcon className="h-6 w-6" />}
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Γενικές</TabsTrigger>
          <TabsTrigger value="notifications">Ειδοποιήσεις</TabsTrigger>
          <TabsTrigger value="appearance">Εμφάνιση</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Γενικές Ρυθμίσεις</CardTitle>
              <CardDescription>
                Διαχειριστείτε τις γενικές ρυθμίσεις του συστήματος
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Οι γενικές ρυθμίσεις θα εμφανίζονται εδώ.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ρυθμίσεις Ειδοποιήσεων</CardTitle>
              <CardDescription>
                Προσαρμόστε τις ειδοποιήσεις που λαμβάνετε
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Οι ρυθμίσεις ειδοποιήσεων θα εμφανίζονται εδώ.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ρυθμίσεις Εμφάνισης</CardTitle>
              <CardDescription>
                Προσαρμόστε την εμφάνιση της εφαρμογής
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Οι ρυθμίσεις εμφάνισης θα εμφανίζονται εδώ.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
