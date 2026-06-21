# Mumbai's Hidden Histories: Complete Setup Guide
### Getting your blog live on the internet in 25 minutes

Everything in this guide is **free** except the two small optional costs noted below. You will not need a credit card for Netlify or Supabase.

---

## What you will end up with

| What | Details |
|---|---|
| Live URL | Something like `https://mumbais-hidden-histories.netlify.app` |
| Custom domain (optional) | `www.mumbaihiddenhistories.com` or whatever you choose |
| Comments | Permanent, shared across all visitors, saved in Supabase |
| AI replies | Each comment gets a personal reply written as Medhansh |
| Comment moderation | You can delete inappropriate comments using a private admin password |
| Free SSL | The padlock in the browser bar, handled automatically by Netlify |

---

## PART 1: SET UP YOUR DATABASE (Supabase)
### Time needed: about 8 minutes

Supabase is the database where reader comments are stored. It is free.

**Step 1.1** Go to https://supabase.com and click **Start your project**

**Step 1.2** Sign up using your Google or GitHub account (no need for a new password)

**Step 1.3** Once inside your dashboard, click **New project**
- Name it: `mumbai-blog`
- Set a database password (save it somewhere, you will not need it often)
- Choose a region: **Singapore** is closest to Mumbai
- Click **Create new project**
- Wait about 60 seconds for it to provision

**Step 1.4** In the left sidebar, click **SQL Editor**

**Step 1.5** Click **New query** (the plus button at the top left of the editor)

**Step 1.6** Copy and paste this entire block into the editor, then click **Run** (the green button):

```sql
-- Create the comments table
CREATE TABLE comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     TEXT NOT NULL,
  name        TEXT NOT NULL,
  text        TEXT NOT NULL,
  ai_reply    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create an index so comment lookups are fast
CREATE INDEX comments_post_id_idx ON comments (post_id, created_at);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to READ comments (your readers can see all comments)
CREATE POLICY "Public can read comments"
  ON comments FOR SELECT
  USING (true);

-- Allow anyone to INSERT comments (your readers can post)
CREATE POLICY "Public can insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);
```

You should see: **Success. No rows returned.**

Note that there is intentionally no policy allowing public deletion. Deletion is handled separately and securely in Part 7, using a private admin password rather than a public database rule, so that nobody but you can remove a comment.

**Step 1.7** Get your credentials:
- Click **Project Settings** (the gear icon at the bottom of the left sidebar)
- Click **API** in the settings menu
- You will see three things you need to copy. Two are for the website itself, and one (the service role key) is only used for comment moderation and must be kept completely private.

  **Project URL**, which looks like `https://abcxyz123.supabase.co`. Copy this.

  **anon public** key, a long string starting with `eyJ...`. Copy this.

  **service_role** key, also a long string starting with `eyJ...` but listed separately and marked secret. Copy this too, and never share it or paste it into `index.html`. It only goes into Netlify's environment variables, covered in Part 7.

---

## PART 2: ADD YOUR CREDENTIALS TO THE WEBSITE FILE
### Time needed: about 2 minutes

**Step 2.1** Open `index.html` in a text editor.
- On Windows: right-click, then Open with, then Notepad (or download VS Code for better editing)
- On Mac: right-click, then Open with, then TextEdit, then Format, then Make Plain Text

**Step 2.2** Use Find and Replace to locate this section near the top of the JavaScript:

```javascript
const SUPABASE_URL      = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

**Step 2.3** Replace the placeholder values with the Project URL and anon public key you copied from Supabase (not the service_role key, which never goes in this file):

```javascript
const SUPABASE_URL      = 'https://abcxyz123.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Step 2.4** Save the file (Ctrl+S on Windows, Cmd+S on Mac).

---

## PART 3: ADD YOUR BLOG CONTENT AND PHOTOS
### Time needed: as long as you need

This is the creative part. In `index.html`, find the `const POSTS = [` section, which contains all 10 posts.

**Image URLs.** Each post has a main image and a smaller in-article gallery image, marked like this:

```javascript
image: '', // paste your main photo URL between the quotes
```

and, further down inside the body text, a gallery block that looks like this:

```html
<div class="post-gallery single">
  <figure>
    <img src="" alt="Description of the photo" />
    <figcaption>PASTE IMAGE URL ABOVE: suggested subject for this photo</figcaption>
  </figure>
</div>
```

To get an image URL, find a photo (your own, or one from Wikimedia Commons, or another source you have rights to use), right-click it, choose "Copy image address," and paste it between the quotes in the `src=""` attribute. A handful of posts already have a verified Wikimedia Commons photo filled in for you, with a small credit line underneath the image, since those photos are under a Creative Commons licence and require attribution. If you replace one of those images with your own photo, you can delete the matching `imageCredit` line, since your own photo will not need a credit.

**Title, era, tags, excerpt, date, readTime.** These are short text fields. Just replace the placeholder text.

**Body (the article content).** Use these HTML elements inside the body:
```html
<p>A normal paragraph of text.</p>

<h2>A section heading</h2>

<blockquote>A memorable quote or pull quote.</blockquote>

<div class="fact-box">
  <span class="fact-box-label">Quick Fact</span>
  <p>A highlighted fact or interesting detail.</p>
</div>
```

The first letter of the first paragraph in each post will automatically be styled as a large drop capital.

---

## PART 4: FILL IN THE CHARITIES PAGE
### Time needed: about 5 minutes

In `index.html`, find the charities section. For each charity card:

1. Replace `// INSERT CHARITY LINK HERE` in the `href=""` with the charity's website
2. Replace `// INSERT IMAGE URL HERE` in the `src=""` with a photo URL
3. Change the category label, charity name, and description

---

## PART 5: DEPLOY TO NETLIFY (GO LIVE)
### Time needed: about 5 minutes

**Step 5.1** Go to https://netlify.com and sign up (free, using Google or GitHub).

**Step 5.2** On your dashboard, you will see a box that says something like: "Want to deploy a new site without connecting to Git? Drag and drop your site output folder here."

**Step 5.3** On your computer, open the `mumbai-blog` folder (the one containing `index.html`).

**Step 5.4** Drag the entire `mumbai-blog` folder onto that Netlify area.

**Step 5.5** Netlify will upload all files and give you a live URL immediately, something like `https://wonderful-curie-4f29a3.netlify.app`. Your website is now live. Anyone in the world can visit it.

**Step 5.6** Rename your site (optional but recommended):
- In Netlify, click your site, then **Site configuration**, then **General**, then **Site details**, then **Change site name**
- You can name it `mumbais-hidden-histories` to get `https://mumbais-hidden-histories.netlify.app`

---

## PART 6: ADD YOUR ANTHROPIC API KEY (enables AI comment replies)
### Time needed: about 3 minutes

**Step 6.1** Go to https://console.anthropic.com and sign in (or create an account).

**Step 6.2** Go to **API Keys** in the left sidebar, then **Create Key**.
- Name it `mumbai-blog`
- Copy the key (it starts with `sk-ant-api03-...`)
- Important: you will only see this key once. Copy it now.

**Step 6.3** Add a small amount of API credit:
- Go to **Billing**, then **Add credits**, minimum $5
- This covers roughly 2,000 to 5,000 comment reply generations

**Step 6.4** Add the key to Netlify:
- In Netlify, click your site, then **Site configuration**, then **Environment variables**
- Click **Add a variable**
  - Key: `ANTHROPIC_API_KEY`
  - Value: paste your `sk-ant-api03-...` key
- Click **Save**

**Step 6.5** Redeploy so Netlify picks up the new variable:
- Go to **Deploys** in Netlify
- Click **Trigger deploy**, then **Deploy site**
- Wait about 30 seconds

AI replies are now active. When anyone posts a comment, Medhansh's AI assistant will post a personalised reply within a few seconds.

---

## PART 7: ENABLE COMMENT MODERATION (delete inappropriate comments)
### Time needed: about 4 minutes

This lets you, and only you, delete a comment permanently if it is inappropriate, spam, or abusive. It works through a private password rather than a public Supabase rule, so visitors cannot delete each other's comments, only you can, and only after entering the correct password.

**Step 7.1** Choose a strong, private admin password. This is separate from your Supabase account password and is never shown to visitors. Treat it like any other important password: do not reuse one you use elsewhere, and do not share it.

**Step 7.2** Add three environment variables in Netlify:
- In Netlify, click your site, then **Site configuration**, then **Environment variables**
- Click **Add a variable** three times and add the following:
  - Key: `ADMIN_PASSWORD`, Value: the password you chose in Step 7.1
  - Key: `SUPABASE_URL`, Value: your Supabase Project URL from Part 1 (the same one you put in `index.html`)
  - Key: `SUPABASE_SERVICE_ROLE_KEY`, Value: the service_role key you copied in Part 1 Step 1.7 (not the anon key)
- Click **Save** after each one

**Step 7.3** Redeploy so Netlify picks up the new variables:
- Go to **Deploys** in Netlify
- Click **Trigger deploy**, then **Deploy site**

**Step 7.4** Using moderation on the live site:
- Open any blog post and scroll to the comments section
- Click the small **Site Owner Login** button above the comments
- Enter your admin password
- Each comment will now show a **Delete** button
- Click Delete on any comment you want to remove, confirm, and it is permanently deleted from the database for everyone

Admin mode only lasts for your current browser tab and turns off automatically when you close it, so you will need to log in again each time you want to moderate. If you enter the wrong password while trying to delete a comment, admin mode turns itself off and you can try logging in again.

---

## PART 8: CUSTOM DOMAIN (optional, roughly 800 to 1500 rupees per year)
### Time needed: about 10 minutes, plus DNS propagation which can take up to 24 hours

If you want `www.mumbaihiddenhistories.com` instead of the `.netlify.app` URL:

**Step 8.1** Buy a domain at https://namecheap.com or https://godaddy.com.
- Search for your desired name
- `.com` domains cost roughly 900 to 1200 rupees per year

**Step 8.2** In Netlify: **Site configuration**, then **Domain management**, then **Add custom domain**.
- Type your domain name and click **Verify**
- Netlify will show you DNS records to add

**Step 8.3** In your domain registrar (Namecheap or GoDaddy):
- Go to DNS settings for your domain
- Add the records Netlify showed you (usually two CNAME or A records)

**Step 8.4** Wait. DNS changes take anywhere from a few minutes to 24 hours to propagate.

**Step 8.5** Netlify automatically provisions a free SSL certificate (the padlock) once DNS is set up. No action needed from you.

---

## UPDATING THE WEBSITE AFTER LAUNCH

Whenever you want to make changes (new post, edit text, add a charity, swap a photo):

1. Open `index.html` on your computer and make your changes
2. Save the file
3. Go to your Netlify dashboard
4. Drag the entire `mumbai-blog` folder onto the deploy area again
5. Netlify redeploys in about 10 seconds

That's it. Your live site updates immediately.

---

## QUICK REFERENCE: Where to find things in index.html

| What you want to change | Where to find it |
|---|---|
| Supabase credentials | Top of the `<script>` tag: `SUPABASE_URL` and `SUPABASE_ANON_KEY` |
| Blog posts (images, text, titles) | The `const POSTS = [` array in the `<script>` tag |
| Charity cards (links, images, descriptions) | In the HTML, look for `CHARITY CARD 1`, `CHARITY CARD 2`, and so on |
| Your About page text and credits | In the HTML, look for the `view-about` section |
| Website title in the browser tab | The `<title>` tag at the very top of the file |
| Masthead title and tagline | Look for `class="masthead"` in the HTML |

---

## TROUBLESHOOTING

**Comments not saving:**
Double check that SUPABASE_URL and SUPABASE_ANON_KEY are correctly pasted in `index.html`. Make sure you ran the SQL script in Step 1.6 exactly as written.

**AI replies not appearing:**
Check that `ANTHROPIC_API_KEY` is set in Netlify Environment Variables. Make sure you triggered a new deploy after adding the variable. Check that you have credits in your Anthropic account.

**Comment deletion not working:**
Check that all three variables, `ADMIN_PASSWORD`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`, are set correctly in Netlify, and that you redeployed after adding them. Double check you copied the service_role key and not the anon key by mistake; they look similar but only the service_role key is allowed to delete rows.

**Images not showing:**
Make sure the URL you pasted is a direct link to an image file, ending in .jpg, .png, .webp, or similar. Test by pasting the URL into a new browser tab; if the image loads there, it will work on the site.

**Site looks broken after redeploying:**
Make sure you are dragging the entire `mumbai-blog` folder, not just `index.html`. The folder must contain `index.html`, `netlify.toml`, and the `netlify` subfolder with both function files inside it.

---

*If you get stuck at any step, the error message from Netlify or Supabase will usually tell you exactly what is wrong. You can also come back and ask for help.*
