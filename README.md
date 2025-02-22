# http-logger

URLパラメータをCSVファイルに記録するだけのサーバです。Stormworks等のゲームからのデータを記録するのに使えます。

## インストール

TypeScript実行環境としてBunを使用します。独自機能を使用しているためNode.jsでは動作しません。

```powershell
winget install Oven-sh.Bun
exit
```

```powershell
bun upgrade

git clone https://github.com/DG-7D/HttpLogger.git
```

## 使い方

以下でサーバが起動します。ポート番号は既定では3000です。環境変数`PORT`で変更できます(PowerShellであれば`$env:PORT = 3000`など)。

```powershell
bun start
```

`http://localhost:3000/?param1=value1&param2=value2`のようにリクエストを送ると、`param1,param2`をヘッダとした`./_csv/yyyyMMddHHmmss.csv`が生成され、`value1,value2`が記録されます。同じパラメータ(順番は問わない)でアクセスすると、同じファイルに追記されます。パラメータの組み合わせが変わると新しいファイルが作成されます。

StormworksのLuaスクリプトであれば以下のようにしてデータを送信できます。

```lua
tick = 0
ready = true

function httpReply()
	ready = true
end

function onTick()
    value1 = input.getNumber(1)
    value2 = input.getNumber(2)
	if ready then
		ready = false
		async.httpGet(3000, "/?tick="..tick .. "&param1="..value1 .. "&param2="..value2)
	end
	tick = tick + 1
end
```