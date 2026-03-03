import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import apiClient from '@/lib/axiosInstance';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('mail');
  const [isLoading, setIsLoading] = useState(false);

  // Mail Settings State
  const [mailSettings, setMailSettings] = useState({
    mail_mailer: 'smtp',
    mail_host: '',
    mail_port: 587,
    mail_username: '',
    mail_password: '',
    mail_encryption: 'tls',
    mail_from_name: '',
  });

  // WhatsApp Settings State
  const [whatsappSettings, setWhatsappSettings] = useState({
    whatsapp_enabled: false,
    whatsapp_url: '',
    whatsapp_key: '',
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch Mail settings
      try {
        const mailResponse = await apiClient.get('admin-dashboard/config/email');
        if (mailResponse?.data?.success) {
          const mailData = mailResponse.data.data || {};
          setMailSettings({
            mail_mailer: mailData.mail_mailer || 'smtp',
            mail_host: mailData.mail_host || '',
            mail_port: mailData.mail_port || 587,
            mail_username: mailData.mail_username || '',
            mail_password: mailData.mail_password || '',
            mail_encryption: mailData.mail_encryption || 'tls',
            mail_from_name: mailData.mail_from_name || '',
          });
        }
      } catch (mailError) {
        console.log('Mail settings not found, using defaults');
      }
      
      // Fetch WhatsApp settings
      try {
        const whatsappResponse = await apiClient.get('admin-dashboard/config/whatsapp');
        if (whatsappResponse?.data?.success) {
          const whatsappData = whatsappResponse.data.data || {};
          setWhatsappSettings({
            whatsapp_enabled: whatsappData.whatsapp_enabled || false,
            whatsapp_url: whatsappData.whatsapp_url || '',
            whatsapp_key: whatsappData.whatsapp_key || '',
          });
        }
      } catch (whatsappError) {
        console.log('WhatsApp settings not found, using defaults');
      }
    } catch (error) {
      console.log('Settings fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMailSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!mailSettings.mail_host.trim()) {
      toast.error('Mail host is required');
      return;
    }
    if (!mailSettings.mail_username.trim()) {
      toast.error('Mail username is required');
      return;
    }
    if (!mailSettings.mail_from_name.trim()) {
      toast.error('From name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        mail_mailer: mailSettings.mail_mailer.trim(),
        mail_host: mailSettings.mail_host.trim(),
        mail_port: parseInt(mailSettings.mail_port) || 587,
        mail_username: mailSettings.mail_username.trim(),
        mail_password: mailSettings.mail_password.trim(),
        mail_encryption: mailSettings.mail_encryption.trim(),
        mail_from_name: mailSettings.mail_from_name.trim(),
      };

      const response = await apiClient.post('admin-dashboard/config/update-email', payload);
      
      // Check for success
      if (response?.data?.success) {
        toast.success(response.data.message || 'Mail settings saved successfully');
      } else {
        throw new Error(response?.data?.message || 'Failed to save mail settings');
      }
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
        const errorData = error.response.data;
        
        if (errorData?.message) {
          toast.error(errorData.message);
        } else if (errorData?.errors) {
          // Handle validation errors - can be string or object
          const validationErrors = errorData.errors;
          
          if (typeof validationErrors === 'string') {
            toast.error(validationErrors);
          } else if (typeof validationErrors === 'object') {
            const firstError = Object.values(validationErrors)[0];
            
            if (Array.isArray(firstError)) {
              toast.error(firstError[0]);
            } else if (typeof firstError === 'string') {
              toast.error(firstError);
            } else {
              toast.error('Validation error occurred');
            }
          } else {
            toast.error('Validation error occurred');
          }
        } else {
          toast.error('Failed to save mail settings');
        }
      } else if (error.request) {
        // Request made but no response
        toast.error('Network error. Please check your connection');
      } else {
        // Other errors
        toast.error(error.message || 'Failed to save mail settings');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (whatsappSettings.whatsapp_enabled) {
      if (!whatsappSettings.whatsapp_url.trim()) {
        toast.error('WhatsApp URL is required when enabled');
        return;
      }
      if (!whatsappSettings.whatsapp_key.trim()) {
        toast.error('WhatsApp API key is required when enabled');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        whatsapp_enabled: whatsappSettings.whatsapp_enabled,
        whatsapp_url: whatsappSettings.whatsapp_url.trim(),
        whatsapp_key: whatsappSettings.whatsapp_key.trim(),
      };

      const response = await apiClient.post('admin-dashboard/config/update-whatsapp', payload);
      
      // Check for success
      if (response?.data?.success) {
        toast.success(response.data.message || 'WhatsApp settings saved successfully');
      } else {
        throw new Error(response?.data?.message || 'Failed to save WhatsApp settings');
      }
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
        const errorData = error.response.data;
        
        if (errorData?.message) {
          toast.error(errorData.message);
        } else if (errorData?.errors) {
          // Handle validation errors - can be string or object
          const validationErrors = errorData.errors;
          
          if (typeof validationErrors === 'string') {
            toast.error(validationErrors);
          } else if (typeof validationErrors === 'object') {
            const firstError = Object.values(validationErrors)[0];
            
            if (Array.isArray(firstError)) {
              toast.error(firstError[0]);
            } else if (typeof firstError === 'string') {
              toast.error(firstError);
            } else {
              toast.error('Validation error occurred');
            }
          } else {
            toast.error('Validation error occurred');
          }
        } else {
          toast.error('Failed to save WhatsApp settings');
        }
      } else if (error.request) {
        // Request made but no response
        toast.error('Network error. Please check your connection');
      } else {
        // Other errors
        toast.error(error.message || 'Failed to save WhatsApp settings');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your application settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted">
          <TabsTrigger 
            value="mail" 
            className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Mail className="w-4 h-4" />
            Mail Settings
          </TabsTrigger>
          <TabsTrigger 
            value="whatsapp" 
            className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Integration
          </TabsTrigger>
        </TabsList>

        {/* Mail Settings Tab */}
        <TabsContent value="mail" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-card p-6"
            >
            <form onSubmit={handleMailSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mail_mailer">Mail Mailer</Label>
                  <Input
                    id="mail_mailer"
                    value={mailSettings.mail_mailer}
                    onChange={(e) => setMailSettings({ ...mailSettings, mail_mailer: e.target.value })}
                    placeholder="smtp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_host">Mail Host *</Label>
                  <Input
                    id="mail_host"
                    value={mailSettings.mail_host}
                    onChange={(e) => setMailSettings({ ...mailSettings, mail_host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_port">Mail Port</Label>
                  <Input
                    id="mail_port"
                    type="number"
                    value={mailSettings.mail_port}
                    onChange={(e) => setMailSettings({ ...mailSettings, mail_port: e.target.value })}
                    placeholder="587"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_encryption">Mail Encryption</Label>
                  <Input
                    id="mail_encryption"
                    value={mailSettings.mail_encryption}
                    onChange={(e) => setMailSettings({ ...mailSettings, mail_encryption: e.target.value })}
                    placeholder="tls"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_username">Mail Username *</Label>
                  <Input
                    id="mail_username"
                    type="email"
                    value={mailSettings.mail_username}
                    onChange={(e) => setMailSettings({ ...mailSettings, mail_username: e.target.value })}
                    placeholder="your-email@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_password">Mail Password</Label>
                  <Input
                    id="mail_password"
                    type="password"
                    value={mailSettings.mail_password}
                    onChange={(e) => setMailSettings({ ...mailSettings, mail_password: e.target.value })}
                    placeholder="Your app password"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mail_from_name">From Name *</Label>
                  <Input
                    id="mail_from_name"
                    value={mailSettings.mail_from_name}
                    onChange={(e) => setMailSettings({ ...mailSettings, mail_from_name: e.target.value })}
                    placeholder="Your Company Name"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="accent-gradient text-accent-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Mail Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
          )}
        </TabsContent>

        {/* WhatsApp Settings Tab */}
        <TabsContent value="whatsapp" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-card p-6"
            >
            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp_enabled" className="text-base">Enable WhatsApp Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on to enable WhatsApp messaging functionality
                  </p>
                </div>
                <Switch
                  id="whatsapp_enabled"
                  checked={whatsappSettings.whatsapp_enabled}
                  onCheckedChange={(checked) =>
                    setWhatsappSettings({ ...whatsappSettings, whatsapp_enabled: checked })
                  }
                />
              </div>

              {whatsappSettings.whatsapp_enabled && (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_url">WhatsApp URL *</Label>
                    <Input
                      id="whatsapp_url"
                      type="url"
                      value={whatsappSettings.whatsapp_url}
                      onChange={(e) =>
                        setWhatsappSettings({ ...whatsappSettings, whatsapp_url: e.target.value })
                      }
                      placeholder="https://your-messenger360-url.com/send"
                      required={whatsappSettings.whatsapp_enabled}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your Messenger360 or WhatsApp API endpoint URL
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_key">WhatsApp API Key *</Label>
                    <Input
                      id="whatsapp_key"
                      type="password"
                      value={whatsappSettings.whatsapp_key}
                      onChange={(e) =>
                        setWhatsappSettings({ ...whatsappSettings, whatsapp_key: e.target.value })
                      }
                      placeholder="your_secret_token"
                      required={whatsappSettings.whatsapp_enabled}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your API authentication token or secret key
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="accent-gradient text-accent-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save WhatsApp Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
