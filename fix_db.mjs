import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  console.log("Fetching products with blob: urls...");
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const product of data) {
    if (product.primary_image_url && product.primary_image_url.startsWith('blob:')) {
      console.log(`Fixing product ${product.id}`);
      const { error: updateError } = await supabase
        .from('products')
        .update({ primary_image_url: null })
        .eq('id', product.id);
      if (updateError) {
        console.error("Error updating:", updateError);
      } else {
        console.log(`Fixed product ${product.id}`);
      }
    }
  }
  console.log("Done");
}

fix();
