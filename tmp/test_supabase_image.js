(async ()=>{
  try {
    const id = 'bcfed117-b70a-4c24-8461-a20a2ce11e51';
    const headers = {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbWd2a2N4aWF3YW10aXd2aWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDE4NjgsImV4cCI6MjA3ODQxNzg2OH0.ij5Cpd2-W7eRA3p5r8mE853I-_6SJ7ESfiR5CEc4_pE',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbWd2a2N4aWF3YW10aXd2aWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDE4NjgsImV4cCI6MjA3ODQxNzg2OH0.ij5Cpd2-W7eRA3p5r8mE853I-_6SJ7ESfiR5CEc4_pE'
    };

    const urlApi = 'https://rkmgvkcxiawamtiwviaj.supabase.co/rest/v1/products?id=eq.' + id + '&select=images';
    const r = await fetch(urlApi, { headers });
    const j = await r.json();
    if (!j || !j[0]) {
      console.error('Produit non trouvé ou réponse invalide');
      process.exit(1);
    }
    const img = (j[0].images && j[0].images[0]) || null;
    console.log('product id:', id);
    console.log('first image:', img);
    if (!img) { console.error('Aucune image trouvée'); process.exit(1); }

    const h = await fetch(img, { method: 'HEAD' });
    console.log('HEAD status:', h.status);
    console.log('content-type:', h.headers.get('content-type'));
    console.log('content-length:', h.headers.get('content-length'));

    const g = await fetch(img);
    const buf = await g.arrayBuffer();
    console.log('GET bytes:', buf.byteLength);
  } catch (e) {
    console.error('Erreur:', e);
    process.exit(1);
  }
})();
