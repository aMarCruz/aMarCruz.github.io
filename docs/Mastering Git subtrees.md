The structure of this repo is based on the [brillant article](https://medium.com/@porteneuve/mastering-git-subtrees-943d29a798ec) from Christophe Porteneuve.

_Original Article:_

> Christophe Porteneuve<br>
> I make cool stuff and teach others to (Git, Rails, JS/CoffeeScript/Node/etc).<br>
> Feb 2, 2015

# Mastering Git subtrees

A month ago we were [exploring Git submodules](https://medium.com/@porteneuve/mastering-git-submodules-34c65e940407); I told you then our next in-depth article would be about subtrees, which are the main alternative.

_**Update March 25, 2016:** I removed all the parts about our now-deprecated git-stree tool. You should look at the awesome [git-subrepo](https://github.com/ingydotnet/git-subrepo#readme) project instead if you want that kind of goodness._

As before, we’ll dive deep and perform every common use-case step by step to illustrate best practices.

In particular, it is important that you assert you [don’t have a choice](https://medium.com/@porteneuve/mastering-git-submodules-34c65e940407#24d3) and must resort to submodules or subtrees instead of a clean, versioned dependency management (which is always better, when doable).

The terminology we’ll use here is the same as in our previous article: we’ll name **“module”** the third-party code we inject somewhere in our container codebase’s tree. The main project’s code, that uses the module internally, will be referred to as **“container.”**

## Subtree fundamentals

**A quick reminder of terminology first: with Git, a repo is local.** The remote version, which is mostly use for archiving, collaboration, sharing, and CI triggers, is called a _remote_. In the remainder of this text, whenever you read “repo” or “Git repo”, remember it’s your local, interactive repo (that is, with a working directory alongside its _.git_ root).

With subtrees, **there are no nested repos:** there’s only one repo, the container, just like a regular codebase. That means just one lifecycle, and **no special tricks to keep in mind for commands and workflows**, it’s business as usual. Ain’t life sweet?

## Three approaches: pick one!

There are three technical ways to handle your subtrees; although it’s sometimes possible to mix these approaches, I recommend you pick one and stick with it, at least on a per-repo basis, to avoid trouble.

### The manual way

Git **does not provide a native _subtree_ command**, unlike what happens for submodules. Subtrees are not so much a feature as they are a **concept**, an **approach** to managing embedded code with Git. They mostly rely on the adequate use of classic porcelain commands (mostly _merge_ and _cherry-pick_), along with a plumbing one (_read-tree_).

The manual approach works everywhere, and is **actually quite simple**, but requires a good understanding of the underlying notions so you execute the few procedures properly. We’ll use that as a starting point, because it offers the best degree of control over operations, and leaves us with **complete freedom** in how we manage history (including its graph) and branches…

### The git subtree contrib script

In June 2012, with version 1.7.11, Git started bundling a **third-party contrib script** name _git-subtree.sh_ in its official distro; it went as far as adding a _git-subtree_ binding to it among its installed binaries, so that you could type git _subtree_ and feel like it were a “native” command.

Integration stops there, however; the “[documentation](https://github.com/git/git/blob/master/contrib/subtree/git-subtree.txt)” is not a man page, and is therefore not installed as such. The usual help calls (_man git-subtree_, _git help subtree_ or _git subtree --help_) are not implemented. A _git subtree_ with no arguments dumps a short synopsis, without further info. Only the text file linked at the beginning of this paragraph provides info, and it is **buried** down in the _contrib/_ directory of your Git install.

_...(From here, the contain referencing git-subtree was removed. I are using git-subrepo)..._

>_One of the key benefits of subtrees is to be able to mix container-specific customizations with general-purpose fixes and enhancements._<br>
>_Still, it’s been here for a while and has therefore been considerably tested (both in the test suite and battle-testing sense), which is not to be dismissed._

### git-subrepo

For a while, we used our own custom solution, named git-stree, that did a reasonable job meeting all our needs, but had a number of dusty corner cases where it would just fall apart. This article used to detail that tool, but starting March 25, 2016 it’s officially deprecated.

This is in favor of a wonderful third-party tool called [git-subrepo](https://github.com/ingydotnet/git-subrepo#readme). If you want to play with subrepo management in a flexible, well-tested, well-documented and rock-solid way, check it out.

This article won’t demonstrate the git-subrepo approaches just now, but rest assured they work. We may find time for that in the future. In the meantime, their docs and guides are great, give it a spin!

## Subtrees, step by step

So, let’s start exploring every common use-case for subtrees in a collaborative project; we’ll detail each of the three approaches, every time.

In order to facilitate your following along, I’ve put together a few **example repos** with their “remotes” (actually just directories). You can uncompress the archive wherever you want, then open a shell (or Git Bash, if you’re on Windows) in the _git-subs_ directory it creates:

[Download the example repos](http://drive.delicious-insights.com/assets/git-subs-demo.zip)

You’ll find three directories in there:

* _main_ acts as the **container** repo, local to the first collaborator,
* _plugin_ acts as the **central maintenance repo** for the module, and
* _remotes_ contains the filesystem remotes for the two previous repos.

In the example commands below, the prompt always displays what approach we’re using and which repo we’re into.

If you’d like to test out _multiple approaches in parallel_, I suggest you **duplicate the unzipped root _git-subs_ directory** as many times as you need (once, or twice) so you can compare the procedures as you go.

## Our subtree structure

It’s pretty simple:

```
.
├── README.md
├── lib
│   └── index.js
└── plugin-config.json
```

Every time, we’ll want to use that subtree in our container codebase, in the _vendor/plugins/demo_ subfolder.

## Adding a subtree

Let’s start by defining a named remote for our subtree’s central repo, so we don’t clutter our CLIs with its path/URL later:

```bash
manually/main (master u=) $ git remote add plugin ../remotes/plugin
manually/main (master u=) $ git fetch plugin
warning: no common commits
remote: Counting objects: 11, done.
remote: Compressing objects: 100% (9/9), done.
remote: Total 11 (delta 1), reused 0 (delta 0)
Unpacking objects: 100% (11/11), done.
From ../remotes/plugin
 * [new branch]      master     -> plugin/master
manually/main (master u=) $
```

We now need to update our index with the contents of this plugin’s _master_ branch, and update our working directory with it; and all this needs to happen in the proper subfolder, too. This is what _read-tree_ does. We’ll use the _-u_ option so the working directory is maintained along with the index.

```bash
manually/main (master u=) $ git read-tree \
  --prefix=vendor/plugins/demo -u plugin/master
manually/main (master + u=) $ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
  new file:   vendor/plugins/demo/README.md
  new file:   vendor/plugins/demo/lib/index.js
  new file:   vendor/plugins/demo/plugin-config.json
```

Awesome. Now let’s finalize that with a commit:

```bash
manually/main (master + u=) $ git commit \
  -m "Added demo plugin subtree in vendor/plugins/demo"
[master 76b347a] Added demo plugin subtree in vendor/plugins/demo
 3 files changed, 19 insertions(+)
 create mode 100644 vendor/plugins/demo/README.md
 create mode 100644 vendor/plugins/demo/lib/index.js
 create mode 100644 vendor/plugins/demo/plugin-config.json
manually/main (master u+1) $
```

There we are! Nothing too fancy!

## Grabbing/updating a repo that uses subtrees
Alright! Now that we saw how to add a subtree, **what do our colleagues have to do to get these** in their local repos?

After all, if we were to use submodules, they’d need either a _git clone --recursive_ to grab it, or the bulletproof sequence of _git fetch + git submodule sync --recursive + git submodule update --init --recursive_ for an existing repo. Ain’t life fun.

Well, you know what? With subtrees, **they don’t need to do anything special.** The reason is simple: there’s **just one repo:** the container.

> _With subtrees, cloning/pulling just works._

Too good to be true? Let’s check. We’ll start by sharing our commit(s) that added the subtree, so our colleagues can clone or pull their repos from the remote. For every copy of the test folder you made, use a _git push_.

```bash
git-subtree/main (master u+2) $ git push
…
manually/main (master u+1) $ git push
…
```

To get an up-to-date repo, **you just need a regular clone/pull**. This works regardless of your original adding approach, so I’ll just show it once:

```bash
manually/main (master u=) $ cd ..
manually $ git clone remotes/main colleague
Cloning into 'colleague'...
done.
manually $ cd colleague
manually/colleague (master u=) $ tree vendor
vendor
└── plugins
    └── demo
        ├── README.md
        ├── lib
        │   └── index.js
        └── plugin-config.json
3 directories, 3 files
```

_(In the Git Bash you get on Windows, you won’t have the tree command; same for OSX or various bare-bones Linux distros: you’ll need to install the command. If you don’t have it, just check the tree using your file explorer or a basic ls -lR command instead.)_

## Getting an update from the subtree’s remote

Now that we have our own repo (_main_) and our “colleague’s” (_colleague_) in place to collaborate, we’ll switch to a third person’s cap: the one in charge of maintaining the plugin. Let’s hop to it:

```bash
manually/colleague (master u=) $ cd ../plugin
manually/plugin (master u=) $ git log --oneline
fe64799 Fix repo name for main project companion demo repo
89d24ad Main files (incl. subdir) for plugin, to populate its tree.
cc88751 Initial commit
```bash

Now, let’s make two pseudo-commits and publish them on the remote:

```bash
manually/plugin (master u=) $ date > fake-work
manually/plugin (master % u=) $ git add fake-work
manually/plugin (master + u=) $ git commit -m "Pseudo-commit #1"
[master 5048a7d] Pseudo-commit #1
 1 file changed, 1 insertion(+)
 create mode 100644 fake-work
manually/plugin (master u+1) $ date >> fake-work
manually/plugin (master * u+1) $ git commit -am "Pseudo-commit #2"
…
manually/plugin (master u+2) $ git push
```

Finally, let’s switch back to our “first developer” cap:

```bash
manually/plugin (master u=) $ cd ../main
manually/main (master u=) $
```

Remember to replicate these operations on every copy of the test folder you’d have made to test multiples approaches (like _git subtree_)…

Let’s now see how we can go about getting these two new commits back in our container’s subtree.

It’s actually pretty easy; we just need to update our local cache from the subtree’s remote, then do a _subtree merge_ (using a squash commit, too, to avoid merging histories). Most of the time, we won’t even have to specify the subdirectory prefix, Git will figure it out:

```bash
manually/main (master u=) $ git fetch plugin
remote: Counting objects: 6, done.
remote: Compressing objects: 100% (5/5), done.
remote: Total 6 (delta 1), reused 0 (delta 0)
Unpacking objects: 100% (6/6), done.
From ../remotes/plugin
   fe64799..dc995bf  master     -> plugin/master
manually/main (master u=) $ git merge -s subtree --squash \
  --allow-unrelated-histories plugin/master
Squash commit -- not updating HEAD
Automatic merge went well; stopped before committing as requested
manually/main (master + u=) $ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
  new file:   vendor/plugins/demo/fake-work
manually/main (master + u=) $ git commit -m "Updated the plugin"
[master 4f9a839] Updated the plugin
 1 file changed, 2 insertions(+)
 create mode 100644 vendor/plugins/demo/fake-work
manually/main (master u+1) $
```

As always, a squash merge doesn’t finalize the commit; it’s quite handy, too, as we may need to adjust other parts of the container code to work properly with the subtree’s updated code. This way we can make a single, working commit.

It can happen that the heuristics use by the _subtree_ merge strategy to figure out the subdirectory prefix get confused; you can then reset the merge and opt instead for the default strategy (_recursive_) with an explicit prefix through its _subtree_ option. The merge command would then be:

```bash
git merge -X subtree=vendor/plugins/demo --squash plugin/master
```

A tad longer, but handy when default subtree heuristics lose their marbles.

## Updating a subtree in-place in the container

It can happen that subtree code can only be used or tested inside container code; most themes and plugins have such constraints. In that situation, you’ll be forced to evolve your subtree code **straight inside the container codebase,** before finally **backporting it** to its remote.

Another common occurrence, which subtrees are good at but submodules cannot cleanly accommodate, is the need to **customize the subtree’s code in a container-specific way,** without pushing these changes back upstream.

You should be careful to distinguish between both situations, putting each use-case into its own commits.

On the other hand, when subtree changes require adjustments in the rest of the container code, **you don’t have to make two separate commits** for it (one for subtree code, one for container code): the commands we’ll use later for backporting can figure the split out, and this will spare you a failing-tests, partly-implemented commit in the container codebase…

Regardless of the selected approach, **these updates are freely performed on the container codebase,** which is the unique repo we’re dealing with when performing them. Collaborators **don’t need any special procedure:** the subtree has no special status. This is an **enormous advantage over submodules,** for which this section would be waaaay longer…

>_Subtree updates can be freely performed within the container codebase._

Let’s unroll a scenario in which we’ll mix four types of commits:

* Commits **touching only the subtree**, intended for backport (e.g. fixes);
* Commits **touching only container code**;
* Commits **touching both container and subtree code**, the latter part being **intended for backport**;
* Commits **touching only the subtree**, in a container-specific way that is **not to be backported**.

You should copy-paste the following set of commands (intentionally listed without prompts) in the _main_ folder of every copy you made (one per approach). Make sure you read the commands’ output and check nothing seems to break, though! You never know…

```bash
git push
echo '// Now super fast' >> vendor/plugins/demo/lib/index.js
git ci -am "[To backport] Faster plugin"
date >> main-file-1
git ci -am "Container-only work"
date >> vendor/plugins/demo/fake-work
date >> main-file-2
git ci -am "[To backport] Timestamping (requires container tweaks)"
echo '// Container-specific' >> vendor/plugins/demo/lib/index.js
git ci -am "Container-specific plugin update"
```

## Backporting to the subtree’s remote

Now let’s see how to backport the necessary commits, once for each approach. We’ll start by looking at our recent commits to keep our history fresh in mind:

```bash
manually/main (master u+4) $ git log --oneline --decorate --stat -5
28e310b (master) Container-specific plugin update
 vendor/plugins/demo/lib/index.js | 1 +
 1 file changed, 1 insertion(+)
71d2d12 [To backport] Timestamping (requires container tweaks)
 main-file-2                   | 1 +
 vendor/plugins/demo/fake-work | 1 +
 2 files changed, 2 insertions(+)
c693673 Container-only work
 main-file-1 | 1 +
 1 file changed, 1 insertion(+)
92bc02d [To backport] Faster plugin
 vendor/plugins/demo/lib/index.js | 1 +
 1 file changed, 1 insertion(+)
4f758af (origin/master) Updated the plugin
 vendor/plugins/demo/fake-work | 2 ++
 1 file changed, 2 insertions(+)
```

We could create synthetic commits in the middle of nowhere, but that’s fugly. I favor creating a local branch specifically for backporting, and have it track the proper remote for our plugin:

```bash
manually/main (master u+4) $ git checkout -b backport-plugin \
  plugin/master
manually/main (backport-plugin u=) $
```

Now let’s cherry-pick the commits we’re interested in (adding a _-x_ into the mix so the commit message has extra lines detailing the source for each cherry pick).

```bash
manually/main (backport-plugin u=) $ git cherry-pick -x master~3
[backport-plugin 953ec4d] [To backport] Faster plugin
 Date: Thu Jan 29 21:54:45 2015 +0100
 1 file changed, 1 insertion(+)
manually/main (backport-plugin u+1) $ git cherry-pick -x \
  --strategy=subtree master^
[backport-plugin 34f50a4] [To backport] Timestamping (requires con…
 Date: Thu Jan 29 21:55:00 2015 +0100
 1 file changed, 1 insertion(+)
manually/main (backport-plugin u+1) $ git log --oneline \
  --decorate --stat -2
34f50a4 (HEAD, backport-plugin) [To backport] Timestamping (requir…
 fake-work | 1 +
 1 file changed, 1 insertion(+)
953ec4d [To backport] Faster plugin
 lib/index.js | 1 +
 1 file changed, 1 insertion(+)
manually/main (backport-plugin u+2) $ git push HEAD:master
Counting objects: 7, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (6/6), done.
Writing objects: 100% (7/7), 877 bytes | 0 bytes/s, done.
Total 7 (delta 2), reused 0 (delta 0)
To ../remotes/plugin
   dc995bf..34f50a4  backport-plugin -> master
```

Just like with _git merge -s subtree plugin/master_ earlier on, Git’s builtin directory heuristics usually do just fine. Astute readers will probably have noticed that _we didn’t even have to specify the subtree strategy_ whenever the heuristics worked out, thanks to non-ambiguous paths in our working directories (the backport branch has different, unprefixed contents).

However, it is prudent to specify _--strategy=subtree_ (_-s_ means something else in _cherry-pick_) to make sure files outside of the subtree (elsewhere in container code) will get quietly ignored, as would happen for _main-file-2_ in _master^_. If you forget this option, Git will refuse to complete the cherry-pick, as it would believe our side (_backport-plugin_) just removed that file (you’d see a _deleted by us_ conflict). So you’d better use that specific option all the time, just to be on the safe side.

The _log_ above confirms the backported files are put in the “plugin root,” properly unprefixed. And the final push lets us publish that backport to the central remote for the plugin.

## Removing a subtree

It’s just a directory in your repo. A good ol’ _git rm_ will do, regardless of the approach you used.

```bash
main (master u=) $ git rm -r vendor/plugins/demo
rm 'vendor/plugins/demo/README.md'
rm 'vendor/plugins/demo/fake-work'
rm 'vendor/plugins/demo/lib/index.js'
rm 'vendor/plugins/demo/plugin-config.json'
main (master + u=) $ git commit -m "Removing demo subtree"
[master 3893865] Removing demo subtree
 4 files changed, 24 deletions(-)
 delete mode 100644 vendor/plugins/demo/README.md
 delete mode 100644 vendor/plugins/demo/fake-work
 delete mode 100644 vendor/plugins/demo/lib/index.js
 delete mode 100644 vendor/plugins/demo/plugin-config.json
main (master u+1) $
```

## Turning a directory into a subtree
This is the last “fun” use-case: you want to take code that **always was an integral part** of your container codebase, and **extract it for sharing** between multiple codebases.

Let’s start by creating a “local remote” folder. You can copy-paste these:

```bash
cd ..
mkdir remotes/myown
cd remotes/myown
git init --bare
cd ../../main
```

We’ll then perform a series of mixed commits touching (or not) a subdirectory in our codebase. I’ll re-use the earlier commands, but change the directory name.

Just copy-paste the commands below in your _“manually”_ copy and, if you played with _git subtree_, in the matching copy as well:

```bash
mkdir -p lib/plugins/myown/lib
echo '// Yo!' > lib/plugins/myown/lib/index.js
git add lib/plugins/myown
git commit -m "Plugin sez: Yo, dawg."
date >> main-file-1
git commit -am "Container-only work"
echo '// Now super fast' > lib/plugins/myown/lib/index.js
date >> main-file-2
git commit -am "Faster plugin (requires container tweaks)"
git push
```

This should create three commits, two of which touch the lib/plugins/myown subdirectory. Then it publishes to the remote (just to avoid +n in our prompts in the following examples).

Manually
The idea is to create a special branch for the future subtree, and filter down its history so it only keeps commits that touched the subdirectory, rewriting the tree root as it goes.

This sounds like heavy-lifting, but it precisely matches what a mode of the “bulldozer” git filter-branch command does: the --subdirectory-filter option. See for yourself:

manually/main (master u=) $ git checkout -b split-plugin
manually/main (split-plugin) $ git filter-branch \
  --subdirectory-filter lib/plugins/myown
Rewrite 973cfacecb645f66b89accedac8780c19140401b (2/2)
Ref 'refs/heads/split-plugin' was rewritten

manually/main (split-plugin) $ git log --oneline --decorate
5af0de1 (HEAD, split-plugin) Faster plugin (requires container twe…
4fc711a Plugin sez: Yo, dawg.

manually/main (split-plugin) $ tree
.
└── lib
    └── index.js

1 directory, 1 file
(Again, tree is not necessarily available on your setup; if it’s missing, go with a basic ls -lR instead.)

Now we just need to push that to the proper remote:

manually/main (split-plugin) $ git remote add myown \
  ../remotes/myown
manually/main (split-plugin) $ git push -u myown \
  split-plugin:master
Counting objects: 8, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (8/8), 617 bytes | 0 bytes/s, done.
Total 8 (delta 0), reused 0 (delta 0)
To ../remotes/myown
 * [new branch]      split-plugin -> master
Branch split-plugin set up to track remote branch master from myow…
manually/main (split-plugin u=) $
At this stage, you can kill the backport branch if you think you won’t need it anymore for later backports. Otherwise just let it be…

There’s no need to replace the lib/plugins/myown subdirectory in master with the result of a read-tree, either: future merge -s subtree --squash calls will work just fine, as if you had injected the contents as a subtree in the first place. Isn’t it handy?

## So, which approach should I use?
The important thing is to **grok the manual approach:** it lets you do what you want, however you want to do it, and therefore devise a series of commands that best fits your strategic choices about branches, commits, backports, etc.

## Want to learn more?

I wrote [a number of Git articles](https://medium.com/@porteneuve), and you might be particularly interested in the following ones:

Our GitHub video series is out! (absolutely kick-ass, even for experts)
Mastering Git submodules (but seriously, use subtrees)
Getting solid at Git merge vs. rebase (a must-read!)
Fix conflicts only once with git rerere (why do it twice?)
How to make Git preserve specific files while merging (sweet trick!)
Also, if you enjoyed this post, say so: upvote it on HN! Thanks a bunch!

---
**Christophe Porteneuve**

I make cool stuff and teach others to (Git, Rails, JS/CoffeeScript/Node/etc).
