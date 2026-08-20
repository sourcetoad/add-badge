# Recipes

Worked examples for badging a real app. See [README](README.md) for the option
reference and [SAMPLES](SAMPLES.md) for previews of each option.

Every example uses the 2.0 command form. For the 1.x equivalents, see
[UPGRADE](UPGRADE.md).

## Android: which files need a badge

An Android app has more than one launcher icon, and which ones matter depends
on how the project was set up. Check the adaptive icon first:

```shell
cat android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
```

| What you see                                             | Project shape       | What to run                                 |
| -------------------------------------------------------- | ------------------- | ------------------------------------------- |
| No such file                                             | Legacy rasters only | One raster pass                             |
| `<foreground android:drawable="@mipmap/…" />`            | Adaptive, raster    | One raster pass (most common)               |
| `<foreground android:drawable="@drawable/…" />` (an XML) | Adaptive, vector    | `--mode android-adaptive` + one raster pass |

The files themselves:

| File                                         | Who sees it                          | Badge it?                                  |
| -------------------------------------------- | ------------------------------------ | ------------------------------------------ |
| `mipmap-*/ic_launcher.{png,webp}`            | Android 7 and older, some launchers  | Yes                                        |
| `mipmap-*/ic_launcher_round.{png,webp}`      | Android 7 and older, round launchers | Yes, if present                            |
| `mipmap-*/ic_launcher_foreground.{png,webp}` | Android 8+ adaptive icon             | Yes (raster foregrounds)                   |
| `drawable/ic_launcher_foreground.xml`        | Android 8+ adaptive icon             | Yes, via `--mode android-adaptive`         |
| `mipmap-*/ic_launcher_background.{png,webp}` | Behind the foreground                | No, the badge would be covered             |
| `mipmap-*/ic_launcher_monochrome.{png,webp}` | Android 13+ themed icons             | No, the system flattens it to a silhouette |
| `res/ic_launcher-playstore.png`              | Play Console listing                 | Only if your pipeline uploads it           |

Two mistakes to avoid, both of which look fine on the device you happen to test
on:

- Badging only `ic_launcher_foreground` leaves Android 7 and older showing an
  unbadged icon.
- Badging only `ic_launcher` leaves Android 8 and newer showing an unbadged
  icon, because the adaptive icon is built from the foreground instead.

`ic_launcher-playstore.png` matches neither name pattern and sits in `res/`
rather than a `mipmap-*` directory, so it needs its own invocation.

## Android: adaptive icon with a raster foreground

The common case. One config file, one command, covering both the adaptive
foreground and the legacy icons:

```json
// badge.android.json
{
  "$schema": "./node_modules/@sourcetoad/add-badge/configuration_schema.json",
  "input": "./android/app/src/main/res/mipmap-*/{ic_launcher,ic_launcher_round,ic_launcher_foreground}.{png,PNG,webp}",
  "backgroundColor": "rgba(242,242,242,1)",
  "textColor": "rgba(0,33,94,1)",
  "shadowColor": "rgba(255,255,255,0.5)"
}
```

```shell
npx add-badge --config badge.android.json --text "$BADGE"
```

To also badge the Play Store listing icon, reuse the same styling and override
just the input, since command line options win over the config file:

```shell
npx add-badge --config badge.android.json \
  --input ./android/app/src/main/res/ic_launcher-playstore.png \
  --text "$BADGE"
```

## Android: adaptive icon with a vector foreground

A vector foreground has no pixels to badge, so it takes the adaptive mode,
which leaves the original drawable alone and layers a generated overlay above
it. Legacy rasters still need the ordinary pass, so this is two invocations:

```json
// badge.android.adaptive.json
{
  "$schema": "./node_modules/@sourcetoad/add-badge/configuration_schema.json",
  "mode": "android-adaptive",
  "input": "./android/app/src/main/res",
  "backgroundColor": "rgba(242,242,242,1)",
  "textColor": "rgba(0,33,94,1)",
  "shadowColor": "rgba(255,255,255,0.5)"
}
```

```json
// badge.android.legacy.json
{
  "$schema": "./node_modules/@sourcetoad/add-badge/configuration_schema.json",
  "input": "./android/app/src/main/res/mipmap-*/{ic_launcher,ic_launcher_round}.{png,PNG,webp}",
  "backgroundColor": "rgba(242,242,242,1)",
  "textColor": "rgba(0,33,94,1)",
  "shadowColor": "rgba(255,255,255,0.5)"
}
```

```shell
npx add-badge --config badge.android.adaptive.json --text "$BADGE"
npx add-badge --config badge.android.legacy.json --text "$BADGE"
```

The legacy glob deliberately omits `ic_launcher_foreground`: in this shape the
foreground is the vector the adaptive pass already handled.

## iOS

Every size in the app icon set, in one pass:

```json
// badge.ios.json
{
  "$schema": "./node_modules/@sourcetoad/add-badge/configuration_schema.json",
  "input": "./ios/App/Images.xcassets/*.appiconset/*.{png,PNG}",
  "backgroundColor": "rgba(255,255,255,1)",
  "textColor": "rgba(28,53,94,1)",
  "shadowColor": "rgba(0,0,0,0)"
}
```

```shell
npx add-badge --config badge.ios.json --text "$BADGE"
```

> [!IMPORTANT]
> That glob includes the 1024px marketing icon (`ItunesArtwork@2x.png` or
> `AppIcon-1024.png`) if it lives in the icon set. Badging adds an alpha
> channel to an image that did not have one, and App Store Connect rejects
> marketing icons containing alpha (`ITMS-90717`). Keep production builds
> unbadged, and if upload validation complains, give the marketing icon its own
> unbadged path by narrowing the glob.

## Splash screens, logos, and web assets

Anything raster can take a badge, and single files are the same command with a
path instead of a glob:

```shell
npx add-badge --input ./src/assets/img/splash-screen.png --text "$BADGE" --gravity northeast
```

```shell
npx add-badge --input "./public/img/**/*.{png,PNG}" --text "$BADGE" --gravity northwest --text-color transparent
```

A transparent text color gives a corner marker with no label, which is a way to
mark non-production builds without covering artwork in readable text.

> [!NOTE]
> Splash screens and web images are usually checked-in source files rather than
> generated build output, so badging edits your working tree. Don't commit from
> a badged tree.

## GitHub Actions

The pattern used across our app pipelines: badge text comes from the workflow,
an empty value means production and skips badging entirely, and badging runs
before the build step that consumes the icons.

```yaml
- name: Badge icons
  if: ${{ inputs.badge != '' }}
  run: |
    npx add-badge --config badge.android.json --text "$BADGE"
    npx add-badge --config badge.ios.json --text "$BADGE"
  env:
    BADGE: ${{ inputs.badge }}
```

```yaml
# in the caller workflow
- uses: ./.github/actions/build_app
  with:
    badge: 'UAT' # alpha builds use 'Alpha'; production passes nothing
```

Useful details:

- Run it before `fastlane`/`gradle`, and after any step that copies or
  generates icons into the platform directory. Badging a source directory that
  a later step overwrites silently loses the badge.
- `--dry-run` prints the file list without writing, which is the quickest way
  to confirm a glob matches what you expect on a runner.
- Paths in a config file resolve relative to the config file, so the same
  config works regardless of the step's `working-directory`.

## Re-runs and retries

A badged image is marked in its metadata, and running again on an already
badged file skips it with a warning and exits `0`, so a retried job is a no-op
instead of stacking a second badge. To change a badge, restore the original
image and run again.
