#include <bits/stdc++.h>
using namespace std;

#define ll long long
int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    cin >> n;
    stack<ll> s;
    for (int i = 0; i < n; i++)
    {
        ll num;
        cin >> num;
        s.push(num);
    }

    vector<int> q;
    ll number = s.top();
    int mininDex = -1;
    q.push_back(-1);
    s.pop();
    int cnt = n;
    while (!s.empty())
    {
        if (s.top() < number){
            mininDex = cnt;
            
        }
        
        number = s.top();       
        q.push_back(mininDex);
        cnt--;
        s.pop();
    }
    int query;
    cin >> query;
    while (query--)
    {
        int num;
        cin >> num;
        cout << q[query - 1] << '\n';
    }
}